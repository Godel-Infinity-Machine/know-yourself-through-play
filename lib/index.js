import { defineTool } from '@deepseek-ai/dsh-tools';
import { JsonTasteStore, memoryPath } from './store.js';
import { recommendationContext, updateMemory } from './memory.js';
import { text } from './model.js';
import { POLICY } from './policy.js';
export const name = 'know-yourself-through-play';
export const inject = ['tools', 'systemPrompt'];
export async function apply(ctx, config = {}) {
    if (config.memoryFile !== undefined && typeof config.memoryFile !== 'string')
        throw new Error('memoryFile must be a local path');
    const store = new JsonTasteStore(memoryPath(config.memoryFile));
    await store.load();
    ctx.systemPrompt.section({ name: 'kytp:policy', order: 650, text: POLICY, interpolate: false });
    ctx.systemPrompt.context({ name: 'kytp:taste', order: 650, required: true, text: () => recommendationContext(store.snapshot()), interpolate: false });
    // Context providers are synchronous in this DSH release. Refresh disk in its documented async waterfall.
    ctx.on('system-prompt/assemble', async (assembly, _context, next) => {
        await store.load();
        const context = assembly.contexts.find(c => c.name === 'kytp:taste');
        if (context)
            context.text = recommendationContext(store.snapshot());
        return next();
    });
    ctx.tools.register(defineTool({
        name: 'taste_memory',
        description: 'Read Taste Memory or save durable exact human evidence and tentative motivation hypotheses. Natural corrections revise affected hypotheses before future recommendations. No web data as human facts. Administrative export/delete/Steam consent stay in the local kytp CLI.',
        parameters: {
            operation: { type: 'string', enum: ['read', 'fact', 'propose', 'revise', 'confirm', 'reject'], required: true },
            quote: { type: 'string', description: 'Exact nonempty quotation from the CURRENT human message; required for fact/revise/confirm/reject.' },
            id: { type: 'string', description: 'Existing hypothesis ID for revise/confirm/reject.' },
            hypothesis: { type: 'json', description: 'For propose/revise: {description, action: string[], feedback: string[], reward: string[], friction: string[], support: evidence ID[], counterEvidence: string[], conditions: string[]}. New hypotheses are always tentative.' },
        },
        output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
        async execute(args, exec) {
            exec.signal.throwIfAborted();
            let evidence;
            if (args.operation !== 'read' && args.operation !== 'propose') {
                const quote = text(args.quote, 'quote');
                const human = exec.agent?.session.deriveMessages().filter(m => m.role === 'user' && m.source.kind === 'user').at(-1);
                const humanText = human?.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
                if (!human || !humanText?.includes(quote))
                    throw new Error('Quote must occur in the current human-authored message; assistant, web and injected context are ineligible');
                if ((args.operation === 'confirm' || args.operation === 'reject') && quote !== humanText.trim())
                    throw new Error('Confirmation/rejection must quote the entire human command, not an extracted substring');
                evidence = { quote, sessionId: String(exec.agent.session.id), messageId: String(human.id) };
            }
            const memory = await updateMemory(store, args.operation, args, evidence);
            return recommendationContext(memory);
        },
    }));
}

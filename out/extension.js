"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const prompt_tsx_1 = require("@vscode/prompt-tsx");
const vscode = __importStar(require("vscode"));
const play_1 = require("./play");
const CAT_NAMES_COMMAND_ID = 'cat.namesInEditor';
const CAT_PARTICIPANT_ID = 'chatdevopsts.cat';
const MODEL_SELECTOR = { vendor: 'copilot', family: 'gpt-3.5-turbo' };
function activate(context) {
    const handler = async (request, context, stream, token) => {
        //
        if (request.command === "teach") {
            stream.progress('Picking the right topic to teach...');
            const topic = getTopic(context.history);
            const messages = [
                vscode.LanguageModelChatMessage.User('You are a cat! Your job is to explain computer science concepts in the funny manner of a cat. Always start your response by stating what concept you are explaining. Always include code samples.'),
                vscode.LanguageModelChatMessage.User(topic)
            ];
            const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
            if (model) {
                const chatResponse = await model.sendRequest(messages, {}, token);
                for await (const fragment of chatResponse.text) {
                    stream.markdown(fragment);
                }
            }
            stream.button({
                command: CAT_NAMES_COMMAND_ID,
                title: vscode.l10n.t('Use Cat Names in Editor')
            });
            return { metadata: { command: 'teach' } };
        }
        else if (request.command === 'play') {
            stream.progress('Throwing away the computer science books and preparing to play with some Python code...');
            const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
            if (model) {
                // Here's an example of how to use the prompt-tsx library to build a prompt
                const { messages } = await (0, prompt_tsx_1.renderPrompt)(play_1.PlayPrompt, { userQuery: request.prompt }, { modelMaxPromptTokens: model.maxInputTokens }, new prompt_tsx_1.Cl100KBaseTokenizer());
                const chatResponse = await model.sendRequest(messages, {}, token);
                for await (const fragment of chatResponse.text) {
                    stream.markdown(fragment);
                }
            }
            return { metadata: { command: 'play' } };
        }
        else {
            const messages = [
                vscode.LanguageModelChatMessage.User(`You are a cat! Think carefully and step by step like a cat would.
                    Your job is to explain computer science concepts in the funny manner of a cat, using cat metaphors. Always start your response by stating what concept you are explaining. Always include code samples.`),
                vscode.LanguageModelChatMessage.User(request.prompt)
            ];
            const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
            if (model) {
                const chatResponse = await model.sendRequest(messages, {}, token);
                for await (const fragment of chatResponse.text) {
                    // Process the output from the language model
                    // Replace all python function definitions with cat sounds to make the user stop looking at the code and start playing with the cat
                    const catFragment = fragment.replace('def', 'meow');
                    stream.markdown(catFragment);
                }
            }
            return { metadata: { command: '' } };
        }
    };
    const cat = vscode.chat.createChatParticipant('chatdevopsts.cat', handler);
}
exports.activate = activate;
// Get a random topic that the cat has not taught in the chat history yet
function getTopic(history) {
    const topics = ['linked list', 'recursion', 'stack', 'queue', 'pointers'];
    // Filter the chat history to get only the responses from the cat
    const previousCatResponses = history.filter(h => {
        return h instanceof vscode.ChatResponseTurn && h.participant === CAT_PARTICIPANT_ID.toString().toString();
    });
    // Filter the topics to get only the topics that have not been taught by the cat yet
    const topicsNoRepetition = topics.filter(topic => {
        return !previousCatResponses.some(catResponse => {
            return catResponse.response.some(r => {
                return r instanceof vscode.ChatResponseMarkdownPart && r.value.value.includes(topic);
            });
        });
    });
    return topicsNoRepetition[Math.floor(Math.random() * topicsNoRepetition.length)] || 'I have taught you everything I know. Meow!';
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
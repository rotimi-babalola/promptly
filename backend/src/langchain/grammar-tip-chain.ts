import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';

const grammarPrompt = new PromptTemplate({
  inputVariables: ['transcript'],
  template: `
You are an expert German language teacher. The student submitted this spoken transcript:

"{transcript}"

The student's grammar or vocabulary needs improvement.

Please:
- Point out specific grammar or vocabulary mistakes if any
- Give brief correction examples
- Share 2 learning tips to help improve

Respond in natural language (not JSON).
`,
});

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 500,
  timeout: 20000,
  maxRetries: 1,
});

export const grammarTipChain = RunnableSequence.from([grammarPrompt, model]);

// src/langchain/feedback-chain.ts
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export interface Feedback {
  fluency: {
    comment: string;
    score: number;
  };
  grammar: {
    comment: string;
    score: number;
  };
  vocabulary: {
    comment: string;
    score: number;
  };
  pronunciation: {
    comment: string;
    score: number;
  };
}

// Instantiate the parser with the desired type.
const parser = new JsonOutputParser<Feedback>();

const feedbackPrompt = new PromptTemplate({
  inputVariables: ['transcript', 'prompt'],

  template: `
You are an expert German language teacher evaluating a student's spoken response to a prompt. Your response MUST be a JSON object, and only a JSON object.

Transcript:
"{transcript}"

Prompt:
"{prompt}"

Evaluate the response using the following criteria. Give feedback for each criterion in the JSON object. Each feedback should include a comment and a score from 1 to 10, where 1 is poor and 10 is excellent.:
- fluency
- grammar
- vocabulary
- pronunciation

Encourage the user with a positive closing message.

{format_instructions}
`,

  partialVariables: { format_instructions: parser.getFormatInstructions() },
});

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const feedbackChain = RunnableSequence.from([
  feedbackPrompt,
  model,
  parser,
]);

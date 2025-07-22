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
  closingMessage: string;
}

// Instantiate the parser with the desired type.
const parser = new JsonOutputParser<Feedback>();

const feedbackPrompt = new PromptTemplate({
  inputVariables: ['transcript', 'prompt', 'languageLevel'],

  template: `
You are an expert German language teacher evaluating a student's spoken response to a prompt. Your response MUST be a JSON object, and only a JSON object.

Transcript:
"{transcript}"

Prompt:
"{prompt}"

Language Level:
"{languageLevel}"

Evaluate the response using the following criteria. Give feedback for each criterion in the JSON object based on how well the student met the expectations for their language level. Each feedback should include a comment and a score from 1 to 10, where 1 is poor and 10 is excellent.:
- fluency
- grammar
- vocabulary
- pronunciation

Include a "closingMessage" field as a string with a positive, encouraging message. Do NOT nest it in an object — just a plain string.

Make sure to follow the structure exactly and do not include any additional text outside the JSON object.
If you cannot evaluate a criterion, set the score to 0 and provide a comment explaining why


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

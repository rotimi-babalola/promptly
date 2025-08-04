import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export interface WriteFeedback {
  correctedText: string;
  grammar: {
    comment: string;
    score: number;
  };
  vocabulary: {
    comment: string;
    score: number;
  };
  structure: {
    comment: string;
    score: number;
  };
  improvements: string[];
  closingMessage: string;
}

// Instantiate the parser with the desired type.
const parser = new JsonOutputParser<WriteFeedback>();

const writeFeedbackPrompt = new PromptTemplate({
  inputVariables: ['userResponse', 'prompt', 'languageLevel'],

  template: `
You are an expert German language teacher evaluating a student's written response to a prompt. Your response MUST be a valid JSON object, and only a JSON object. Do not include any text before or after the JSON.

Original Prompt:
"{prompt}"

Student's Response:
"{userResponse}"

Language Level:
"{languageLevel}"

Please provide comprehensive feedback on the student's written German. Your response must be a JSON object with exactly this structure:

{{
  "correctedText": "The student's text corrected for grammar, spelling, and vocabulary errors",
  "grammar": {{
    "comment": "Detailed comment about grammar accuracy and sentence structure",
    "score": 7
  }},
  "vocabulary": {{
    "comment": "Detailed comment about word choice and vocabulary appropriateness", 
    "score": 6
  }},
  "structure": {{
    "comment": "Detailed comment about text organization and coherence",
    "score": 8
  }},
  "improvements": [
    "First specific, actionable tip for improvement",
    "Second specific, actionable tip for improvement", 
    "Third specific, actionable tip for improvement"
  ],
  "closingMessage": "A positive, encouraging message as a plain string"
}}

Requirements:
- Each score must be a number from 1 to 10
- Comments must be detailed and helpful
- Improvements must be 3-5 actionable tips
- Consider the language level ("{languageLevel}") in your feedback
- For beginners: focus on basic grammar and vocabulary
- For intermediate: emphasize complex structures and varied vocabulary  
- For native-level: focus on nuance and style
- CRITICAL: Return only valid JSON, no additional text

{format_instructions}
`,

  partialVariables: { format_instructions: parser.getFormatInstructions() },
});

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 1200,
  timeout: 25000,
  maxRetries: 1,
});

export const writeFeedbackChain = RunnableSequence.from([
  writeFeedbackPrompt,
  model,
  parser,
]);

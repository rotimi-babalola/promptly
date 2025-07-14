export const prompts = [
  'Describe your morning routine.',
  'Talk about your favorite meal.',
  'Explain why you like (or dislike) rainy days.',
  'Describe your ideal vacation spot.',
  'Talk about a book or movie you recently enjoyed.',
  'Explain how you get to work or school.',
  'Describe your best friend.',
  'Talk about a hobby you would like to try.',
  'Describe your favorite season and why.',
  'Explain what you did last weekend.',
  'Talk about a person you admire.',
  'Describe your dream job.',
  'Explain how you celebrate your birthday.',
  'Talk about a goal you have for this year.',
  'Describe your favorite music or band.',
  'Explain what you pack for a day trip.',
  'Talk about a childhood memory.',
  'Describe your favorite city or place in your country.',
  'Explain how you stay healthy.',
  'Talk about something that makes you laugh.',
];

export const getRandomPrompt = () =>
  prompts[Math.floor(Math.random() * prompts.length)];

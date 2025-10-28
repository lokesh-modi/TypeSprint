import wordsData from '../data/words.json';
import quotesData from '../data/quotes.json';

// Generate random words
export const generateWords = (count: number = 50): string[] => {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wordsData.length);
    words.push(wordsData[randomIndex]);
  }
  return words;
};

// Get a random quote and split into words
export const getRandomQuote = (): string[] => {
  const randomIndex = Math.floor(Math.random() * quotesData.length);
  const quote = quotesData[randomIndex];
  return quote.split(' ');
};

// Generate text for test (supports "infinite" generation)
export const generateTestText = (
  mode: 'words' | 'quotes' | 'zen',
  initialCount: number = 50
): string[] => {
  switch (mode) {
    case 'quotes':
      return getRandomQuote();
    case 'zen':
      // Optional "Zen" mode (motivational phrases)
      return ['Stay', 'calm', 'and', 'keep', 'typing.'];
    default:
      return generateWords(initialCount);
  }
};

// Function to extend words dynamically during test
export const extendTestText = (
  currentWords: string[],
  mode: 'words' | 'quotes' | 'zen',
  threshold: number = 10,      // When 10 words remain, load more
  extendCount: number = 50     // How many new words to add
): string[] => {
  if (currentWords.length < threshold) {
    const newWords =
      mode === 'quotes'
        ? getRandomQuote()
        : mode === 'zen'
        ? ['Focus', 'and', 'breathe.']
        : generateWords(extendCount);

    return [...currentWords, ...newWords];
  }
  return currentWords;
};


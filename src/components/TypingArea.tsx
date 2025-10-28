import { useEffect, useRef } from 'react';
import { TestState } from '../types';

interface TypingAreaProps {
  words: string[];
  testState: TestState;
  onKeyPress: (key: string) => void;
  showTimer: boolean;
}

export const TypingArea = ({ words, testState, onKeyPress, showTimer }: TypingAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    onKeyPress(e.key);
  };

  const typedWords = testState.typedText.trim().split(' ');

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {showTimer && !testState.isFinished && (
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-accent tracking-tight">
            {testState.timeRemaining}
          </div>
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={testState.isFinished}
        />

        <div
          className="text-display leading-relaxed cursor-text select-none"
          onClick={() => inputRef.current?.focus()}
          tabIndex={0}
          role="textbox"
          aria-label="Typing area"
        >
          {words.slice(0, 30).map((word, wordIndex) => {
            const originalWord = word;
            const typedWord = typedWords[wordIndex] || '';
            const isCurrentWord = wordIndex === testState.currentWordIndex;
            const isPastWord = wordIndex < testState.currentWordIndex;

            return (
              <span key={wordIndex} className="inline-block mr-3 mb-2">
                {isPastWord ? (
                  <>
                    {typedWord.split('').map((char, charIndex) => {
                      const originalChar = originalWord[charIndex];
                      const isCorrect = originalChar === char;
                      const isExtra = charIndex >= originalWord.length;
                      return (
                        <span
                          key={charIndex}
                          className={`${
                            isExtra
                              ? 'text-incorrect'
                              : isCorrect
                              ? 'text-correct'
                              : 'text-incorrect'
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </>
                ) : isCurrentWord ? (
                  <>
                    {typedWord.split('').map((char, charIndex) => {
                      const originalChar = originalWord[charIndex];
                      const isCorrect = originalChar === char;
                      const isExtra = charIndex >= originalWord.length;
                      const isCursorPosition =
                        charIndex === testState.currentCharIndex - 1 &&
                        !testState.isFinished;

                      return (
                        <span
                          key={charIndex}
                          className={`relative ${
                            isExtra
                              ? 'text-incorrect'
                              : isCorrect
                              ? 'text-correct'
                              : 'text-incorrect'
                          }`}
                        >
                          {char}
                          {/* If cursor should appear after this character */}
                          {isCursorPosition && (
                            <span className="cursor animate-pulse">|</span>
                          )}
                        </span>
                      );
                    })}

                    {/* Cursor when word is empty (at start of typing) */}
                    {typedWord.length === 0 && !testState.isFinished && (
                      <span className="cursor animate-pulse">|</span>
                    )}

                    {/* Remaining chars in current word */}
                    {originalWord.slice(typedWord.length).split('').map((char, charIndex) => (
                      <span
                        key={`remaining-${charIndex}`}
                        className="text-secondary"
                      >
                        {char}
                      </span>
                    ))}

                    {/* Cursor at end of typed word */}
                    {typedWord.length === originalWord.length && !testState.isFinished && (
                      <span className="blinking-cursor"/>
                    )}
                  </>
                ) : (
                  <>
                    {originalWord.split('').map((char, charIndex) => (
                      <span key={charIndex} className="text-secondary">
                        {char}
                      </span>
                    ))}
                  </>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {!testState.isStarted && (
        <div className="text-center mt-12 text-secondary text-sm">
          Start typing to begin the test
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { TestState, TestResults, Settings } from '../types';
import { generateTestText } from '../utils/textGenerator';
import { calculateResults } from '../utils/calculations';
import { saveBestWPM } from '../utils/storage';

interface UseTypingTestReturn {
  testState: TestState;
  testWords: string[];
  results: TestResults | null;
  handleKeyPress: (key: string) => void;
  resetTest: () => void;
}

export const useTypingTest = (settings: Settings): UseTypingTestReturn => {
  const [testWords, setTestWords] = useState<string[]>([]);
  const [testState, setTestState] = useState<TestState>({
    isStarted: false,
    isFinished: false,
    currentWordIndex: 0,
    currentCharIndex: 0,
    typedText: '',
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    startTime: null,
    endTime: null,
    timeRemaining: settings.testDuration
  });
  const [results, setResults] = useState<TestResults | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const testStateRef = useRef<TestState>(testState);

  // 🔹 Keep latest testState in ref for stable key handlers
  useEffect(() => {
    testStateRef.current = testState;
  }, [testState]);

  // ✅ Separate word generation from full reset
  useEffect(() => {
    const words = generateTestText(settings.testMode, 100);
    setTestWords(words);

    // Only reset timing-related fields, not full reinitialization
    setTestState(prev => ({
      ...prev,
      isStarted: false,
      isFinished: false,
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedText: '',
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      startTime: null,
      endTime: null,
      timeRemaining: settings.testDuration
    }));

    setResults(null);
  }, [settings.testMode, settings.testDuration]);

  // ✅ Timer logic
  useEffect(() => {
    if (testState.isStarted && !testState.isFinished && settings.testMode !== 'zen') {
      timerRef.current = setInterval(() => {
        setTestState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            finishTest();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);

      return () => clearInterval(timerRef.current!);
    }
  }, [testState.isStarted, testState.isFinished, settings.testMode]);

  // ✅ Finish test cleanly
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTestState(prev => {
      const endTime = Date.now();
      const timeTaken = prev.startTime
        ? (endTime - prev.startTime) / 1000
        : settings.testDuration;

      const results = calculateResults(prev.correctChars, prev.totalChars, timeTaken);
      setResults(results);
      saveBestWPM(results.wpm);

      return { ...prev, isFinished: true, endTime };
    });
  }, [settings.testDuration]);

  // ✅ Handle key presses
  const handleKeyPress = useCallback((key: string) => {
    const state = testStateRef.current;
    if (state.isFinished) return;

    // Start timer on first keypress
    if (!state.isStarted) {
      setTestState(prev => ({
        ...prev,
        isStarted: true,
        startTime: Date.now()
      }));
    }

    const currentWord = testWords[state.currentWordIndex];
    if (!currentWord) return;

    // --- Backspace ---
    if (key === 'Backspace') {
      if (state.currentCharIndex > 0) {
        setTestState(prev => ({
          ...prev,
          currentCharIndex: prev.currentCharIndex - 1,
          typedText: prev.typedText.slice(0, -1),
        }));
      }
      return;
    }

    // --- Space key ---
    if (key === ' ') {
      if (state.currentCharIndex > 0) {
        if (state.currentWordIndex >= testWords.length - 1) {
          const newWords = generateTestText(settings.testMode, 50);
          setTestWords(prev => [...prev, ...newWords]);
        }

        setTestState(prev => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          currentCharIndex: 0,
          typedText: prev.typedText + ' '
        }));
      }
      return;
    }

    // --- Regular character ---
    if (key.length === 1) {
      const isCorrect = currentWord[state.currentCharIndex] === key;

      setTestState(prev => ({
        ...prev,
        currentCharIndex: prev.currentCharIndex + 1,
        typedText: prev.typedText + key,
        correctChars: prev.correctChars + (isCorrect ? 1 : 0),
        totalChars: prev.totalChars + 1,
        errors: prev.errors + (isCorrect ? 0 : 1)
      }));
    }
  }, [testWords, settings.testMode]);

  // ✅ Reset test (manual restart)
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const words = generateTestText(settings.testMode, 100);
    setTestWords(words);
    setTestState(prev => ({
      ...prev,
      isStarted: false,
      isFinished: false,
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedText: '',
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      startTime: null,
      endTime: null,
      timeRemaining: settings.testDuration
    }));
    setResults(null);
  }, [settings.testMode, settings.testDuration]);

  return {
    testState,
    testWords,
    results,
    handleKeyPress,
    resetTest
  };
};

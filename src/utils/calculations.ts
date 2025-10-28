import { TestResults } from '../types';

export const calculateWPM = (correctChars: number, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0;
  const words = correctChars / 5;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

export const calculateResults = (
  correctChars: number,
  totalChars: number,
  timeInSeconds: number
): TestResults => {
  const wpm = calculateWPM(correctChars, timeInSeconds);
  const accuracy = calculateAccuracy(correctChars, totalChars);
  const incorrectChars = totalChars - correctChars;

  return {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    totalChars,
    timeTaken: timeInSeconds
  };
};

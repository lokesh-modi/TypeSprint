export type Theme = 'dark' | 'light' | 'neon';
export type FontStyle = 'sans' | 'mono' | 'handwriting';
export type TestMode = 'words' | 'quotes' | 'zen';
export type TestDuration = 15 | 30 | 60 | 120;

export interface Settings {
  theme: Theme;
  fontStyle: FontStyle;
  soundEnabled: boolean;
  showTimer: boolean;
  testDuration: TestDuration;
  testMode: TestMode;
}

export interface TestState {
  isStarted: boolean;
  isFinished: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  typedText: string;
  errors: number;
  correctChars: number;
  totalChars: number;
  startTime: number | null;
  endTime: number | null;
  timeRemaining: number;
}

export interface TestResults {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeTaken: number;
}

export interface CharStatus {
  char: string;
  status: 'correct' | 'incorrect' | 'pending';
}

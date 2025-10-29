import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TypingArea } from './components/TypingArea';
import { Results } from './components/Results';
import { SettingsModal } from './components/SettingsModal';
import { useTypingTest } from './hooks/useTypingTest';
import { loadSettings, saveSettings, loadBestWPM } from './utils/storage';
import { Settings } from './types';
import { Heart } from 'lucide-react';
function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [bestWPM, setBestWPM] = useState(loadBestWPM());

  const { testState, testWords, results, handleKeyPress, resetTest } = useTypingTest(settings);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font', settings.fontStyle);
  }, [settings.theme, settings.fontStyle]);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    resetTest(); // Add this to reset the test when settings change
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    resetTest();
  };

  useEffect(() => {
    if (results) {
      const currentBest = loadBestWPM();
      if (results.wpm > currentBest) {
        setBestWPM(results.wpm);
      }
    }
  }, [results]);

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        setShowSettings(prev => !prev);
      } else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        resetTest();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (showSettings) {
          setShowSettings(false);
        } else {
          resetTest();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [showSettings, resetTest]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onOpenSettings={() => setShowSettings(true)} bestWPM={bestWPM} />

      <main className="flex-1 flex items-center justify-center py-12">
        {testState.isFinished && results ? (
          <Results
            results={results}
            onRestart={resetTest}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : (
          <TypingArea
            words={testWords}
            testState={testState}
            onKeyPress={handleKeyPress}
            showTimer={settings.showTimer && settings.testMode !== 'zen'}
          />
        )}
      </main>

      <footer className="py-6 text-center text-sm text-secondary">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>Tab to restart</span>
          <span>•</span>
          <span>Shift + Tab for settings</span>
          <span>•</span>
          <span>Esc to reset</span>
        </div>
        <p>Made with <Heart className="inline text-red-500 mx-1" size={16} /> by Lokesh Modi</p>

      </footer>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={handleCloseSettings}
        />
      )}
    </div>
  );
}

export default App;

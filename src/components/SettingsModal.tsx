import { Settings, Theme, FontStyle, TestMode, TestDuration } from '../types';
import { X } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsModal = ({ settings, onSettingsChange, onClose }: SettingsModalProps) => {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <SettingGroup title="Test Mode">
            <div className="grid grid-cols-3 gap-3">
              <SettingButton
                active={settings.testMode === 'words'}
                onClick={() => updateSetting('testMode', 'words')}
              >
                Words
              </SettingButton>
              <SettingButton
                active={settings.testMode === 'quotes'}
                onClick={() => updateSetting('testMode', 'quotes')}
              >
                Quotes
              </SettingButton>
              <SettingButton
                active={settings.testMode === 'zen'}
                onClick={() => updateSetting('testMode', 'zen')}
              >
                Zen
              </SettingButton>
            </div>
          </SettingGroup>

          <SettingGroup title="Duration (seconds)">
            <div className="grid grid-cols-4 gap-3">
              {[15, 30, 60, 120].map((duration) => (
                <SettingButton
                  key={duration}
                  active={settings.testDuration === duration}
                  onClick={() => updateSetting('testDuration', duration as TestDuration)}
                >
                  {duration}
                </SettingButton>
              ))}
            </div>
          </SettingGroup>

          <SettingGroup title="Theme">
            <div className="grid grid-cols-3 gap-3">
              <SettingButton
                active={settings.theme === 'dark'}
                onClick={() => updateSetting('theme', 'dark')}
              >
                Dark
              </SettingButton>
              <SettingButton
                active={settings.theme === 'light'}
                onClick={() => updateSetting('theme', 'light')}
              >
                Light
              </SettingButton>
              <SettingButton
                active={settings.theme === 'neon'}
                onClick={() => updateSetting('theme', 'neon')}
              >
                Neon
              </SettingButton>
            </div>
          </SettingGroup>

          <SettingGroup title="Font Style">
            <div className="grid grid-cols-3 gap-3">
              <SettingButton
                active={settings.fontStyle === 'sans'}
                onClick={() => updateSetting('fontStyle', 'sans')}
              >
                Sans
              </SettingButton>
              <SettingButton
                active={settings.fontStyle === 'mono'}
                onClick={() => updateSetting('fontStyle', 'mono')}
              >
                Mono
              </SettingButton>
              <SettingButton
                active={settings.fontStyle === 'handwriting'}
                onClick={() => updateSetting('fontStyle', 'handwriting')}
              >
                Handwriting
              </SettingButton>
            </div>
          </SettingGroup>

          <SettingGroup title="Display Options">
            <div className="space-y-3">
              <ToggleOption
                label="Show Timer"
                checked={settings.showTimer}
                onChange={(checked) => updateSetting('showTimer', checked)}
              />
              <ToggleOption
                label="Sound Effects"
                checked={settings.soundEnabled}
                onChange={(checked) => updateSetting('soundEnabled', checked)}
              />
            </div>
          </SettingGroup>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="btn-primary w-full py-3 rounded-xl font-semibold"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingGroup = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

const SettingButton = ({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-4 rounded-lg font-medium transition-all ${
        active
          ? 'bg-accent text-white'
          : 'bg-surface text-secondary hover:bg-surface-hover'
      }`}
    >
      {children}
    </button>
  );
};

const ToggleOption = ({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <label className="flex items-center justify-between p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface-hover transition-colors">
      <span className="text-primary font-medium">{label}</span>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-border'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

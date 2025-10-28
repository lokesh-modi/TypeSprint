import { TestResults } from '../types';
import { RotateCw, TrendingUp, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ResultsProps {
  results: TestResults;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const Results = ({ results, onRestart, onOpenSettings }: ResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <div className="mb-4">
          <div className="text-8xl font-bold text-accent mb-2 tracking-tight">
            {results.wpm}
          </div>
          <div className="text-2xl text-secondary">Words Per Minute</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Accuracy"
          value={`${results.accuracy}%`}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Correct"
          value={results.correctChars}
        />
        <StatCard
          icon={<XCircle className="w-5 h-5" />}
          label="Incorrect"
          value={results.incorrectChars}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total"
          value={results.totalChars}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Time"
          value={`${results.timeTaken}s`}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
        >
          <RotateCw className="w-5 h-5" />
          Try Again
        </button>
        <button
          onClick={onOpenSettings}
          className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
        >
          Change Settings
        </button>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <div className="bg-surface rounded-xl p-6 flex flex-col items-center justify-center gap-2 border border-border">
      <div className="text-accent">{icon}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-secondary">{label}</div>
    </div>
  );
};

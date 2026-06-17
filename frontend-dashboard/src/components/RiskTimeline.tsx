// frontend-dashboard/src/components/RiskTimeline.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TimelineEntry {
  date: string;
  risk_score: number;
  risk_level: string;
  main_concern: string;
  explanation: string;
}

interface RiskTimelineProps {
  childId?: string;
  data?: any;
}

const RiskTimeline: React.FC<RiskTimelineProps> = ({ childId, data }) => {
  // Демо-дані для MVP (замінити на реальні з API)
  const timelineData: TimelineEntry[] = [
    {
      date: "2026-06-16",
      risk_score: 0.82,
      risk_level: "HIGH",
      main_concern: "depression + bullying",
      explanation: "Низька енергія + згадки про обзивання в школі"
    },
    {
      date: "2026-06-15",
      risk_score: 0.65,
      risk_level: "MEDIUM",
      main_concern: "anxiety",
      explanation: "Хвилювання через школу"
    },
    {
      date: "2026-06-14",
      risk_score: 0.91,
      risk_level: "CRITICAL",
      main_concern: "family_safety",
      explanation: "Боїться повертатися додому"
    },
    {
      date: "2026-06-13",
      risk_score: 0.45,
      risk_level: "MEDIUM",
      main_concern: "social_withdrawal",
      explanation: "Хоче бути сам"
    },
    {
      date: "2026-06-12",
      risk_score: 0.28,
      risk_level: "LOW",
      main_concern: "stable",
      explanation: "Добрий настрій"
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-red-600 text-white";
      case "HIGH": return "bg-orange-600 text-white";
      case "MEDIUM": return "bg-yellow-500 text-black";
      case "LOW": return "bg-green-600 text-white";
      default: return "bg-gray-600";
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous + 0.1) return <TrendingUp className="text-red-500" size={18} />;
    if (current < previous - 0.1) return <TrendingDown className="text-green-500" size={18} />;
    return <Minus className="text-gray-400" size={18} />;
  };

  return (
    <div className="monster-card bg-gray-900 border border-gray-700 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Динаміка ризику (7 днів)</h2>
        <div className="text-sm text-gray-400">Оновлено щогодини</div>
      </div>

      <div className="space-y-6">
        {timelineData.map((entry, index) => {
          const prevScore = index < timelineData.length - 1 
            ? timelineData[index + 1].risk_score 
            : entry.risk_score;

          return (
            <div key={entry.date} className="flex gap-6 items-start group">
              {/* Date */}
              <div className="w-20 flex-shrink-0 pt-1">
                <div className="text-sm font-mono text-gray-400">
                  {new Date(entry.date).toLocaleDateString('uk-UA', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </div>
              </div>

              {/* Vertical Line + Dot */}
              <div className="relative flex flex-col items-center pt-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/30 z-10" />
                {index < timelineData.length - 1 && (
                  <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500 to-transparent mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getRiskColor(entry.risk_level)}`}>
                    {entry.risk_level} • {(entry.risk_score * 100).toFixed(0)}%
                  </span>
                  
                  {getTrendIcon(entry.risk_score, prevScore)}
                </div>

                <div className="mt-2 text-lg font-medium text-white">
                  {entry.main_concern}
                </div>
                
                <p className="text-gray-400 text-sm mt-1 leading-snug">
                  {entry.explanation}
                </p>

                {/* Registry correlation hint */}
                {entry.risk_score > 0.7 && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs bg-gray-800 px-3 py-1 rounded-full text-amber-400">
                    ⚠️ Корелює з даними реєстрів
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6 pt-4 border-t border-gray-700 text-xs text-gray-500">
        Базується на RCADS-11 + PHQ-9A • Тренд за останні 7 днів
      </div>
    </div>
  );
};

export default RiskTimeline;

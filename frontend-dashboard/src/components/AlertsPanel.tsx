// frontend-dashboard/src/components/AlertsPanel.tsx
import React from 'react';
import { AlertTriangle, Clock, UserCheck, Bell } from 'lucide-react';

interface Alert {
  id: string;
  child_session_id: string;
  risk_level: string;
  risk_score: number;
  main_concern: string;
  timestamp: string;
  explanation: string;
  recommended_action: string;
}

const mockAlerts: Alert[] = [
  {
    id: "alert_001",
    child_session_id: "demo_child_anon_748392",
    risk_level: "CRITICAL",
    risk_score: 0.91,
    main_concern: "family_safety + depression",
    timestamp: "2026-06-16T14:32:00Z",
    explanation: "Дитина боїться йти додому + виражена апатія останні 3 дні",
    recommended_action: "urgent_intervention"
  },
  {
    id: "alert_002",
    child_session_id: "demo_child_anon_748393",
    risk_level: "HIGH",
    risk_score: 0.78,
    main_concern: "bullying",
    timestamp: "2026-06-16T11:15:00Z",
    explanation: "Повторювані згадки про обзивання в школі",
    recommended_action: "alert_psychologist"
  },
  {
    id: "alert_003",
    child_session_id: "demo_child_anon_748394",
    risk_level: "MEDIUM",
    risk_score: 0.62,
    main_concern: "anxiety",
    timestamp: "2026-06-15T09:45:00Z",
    explanation: "Підвищена тривожність перед шкільними подіями",
    recommended_action: "monitor"
  },
];

const AlertsPanel: React.FC = () => {
  const getRiskBadge = (level: string) => {
    const styles = {
      CRITICAL: "bg-red-600 text-white border-red-500",
      HIGH: "bg-orange-600 text-white border-orange-500",
      MEDIUM: "bg-yellow-500 text-black border-yellow-400",
      LOW: "bg-green-600 text-white border-green-500",
    };
    return styles[level as keyof typeof styles] || "bg-gray-600";
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "urgent_intervention": return "Негайне втручання";
      case "alert_psychologist": return "Повідомити психолога";
      case "monitor": return "Підсилити спостереження";
      default: return "Моніторинг";
    }
  };

  return (
    <div className="p-6 border-b border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <Bell className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Активні алерти</h2>
            <p className="text-sm text-gray-400">Служба у справах дітей</p>
          </div>
        </div>
        <span className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-full font-medium">
          {mockAlerts.length} активних
        </span>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-4 py-1 text-xs font-bold rounded-full mb-3 ${getRiskBadge(alert.risk_level)}`}>
                  {alert.risk_level} • {(alert.risk_score * 100).toFixed(0)}%
                </span>
                <div className="font-semibold text-lg text-white">
                  {alert.main_concern}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(alert.timestamp).toLocaleTimeString('uk-UA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-3 line-clamp-2">
              {alert.explanation}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-gray-500">
                Рекомендація
              </div>
              <button 
                onClick={() => alert(`Дія: ${getActionLabel(alert.recommended_action)} для ${alert.child_session_id}`)}
                className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-2xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <UserCheck size={16} />
                {getActionLabel(alert.recommended_action)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Немає активних алертів наразі
        </div>
      )}

      <div className="text-center mt-6">
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Переглянути всі алерти →
        </button>
      </div>
    </div>
  );
};

export default AlertsPanel;

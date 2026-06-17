// frontend-dashboard/src/components/ChildProfile.tsx
import React from 'react';
import { User, Calendar, School, Home, Heart } from 'lucide-react';

interface ChildProfileProps {
  childId?: string;
  data?: any;
}

const ChildProfile: React.FC<ChildProfileProps> = ({ childId, data }) => {
  // Демо-дані для MVP
  const profile = {
    child_session_id: childId || "demo_child_anon_748392",
    age: 13,
    gender: "Дівчинка",
    last_active: "Сьогодні о 14:32",
    overall_risk: data?.analysis?.risk_score || 0.82,
    risk_level: data?.analysis?.risk_level || "HIGH",
    avatar_emoji: "👧",
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-red-500 border-red-500";
      case "HIGH": return "text-orange-500 border-orange-500";
      case "MEDIUM": return "text-yellow-500 border-yellow-500";
      default: return "text-green-500 border-green-500";
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-7xl shadow-2xl border-4 border-gray-800">
            {profile.avatar_emoji}
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-400">Анонімізований ID</div>
            <div className="font-mono text-xs text-gray-500 mt-1">
              {profile.child_session_id}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Профіль дитини</h1>
              <p className="text-gray-400 mt-1">Вік: {profile.age} років • {profile.gender}</p>
            </div>

            <div className={`px-6 py-3 rounded-2xl border-2 font-semibold text-center ${getRiskColor(profile.risk_level)}`}>
              <div className="text-xs tracking-widest uppercase">Поточний ризик</div>
              <div className="text-4xl font-bold">
                {(profile.overall_risk * 100).toFixed(0)}%
              </div>
              <div className="text-sm">{profile.risk_level}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {/* School Info */}
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <School className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Освіта (eKool / Мрія)</div>
                <div className="font-medium mt-1">Оцінки: <span className="text-orange-400">падіння</span></div>
                <div className="text-sm text-gray-500">Пропуски: 7 за останній місяць</div>
              </div>
            </div>

            {/* Family Info */}
            <div className="flex gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <Home className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Сімейний стан</div>
                <div className="font-medium mt-1">Нещодавнє розлучення батьків</div>
                <div className="text-sm text-gray-500">Високий ризик</div>
              </div>
            </div>

            {/* Health / Last Activity */}
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Останній контакт</div>
                <div className="font-medium mt-1">{profile.last_active}</div>
                <div className="text-sm text-emerald-400">Активний через Аватара</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 pt-6 border-t border-gray-700 flex flex-wrap gap-3">
        <button 
          onClick={() => alert("Відкрито чат з психологом")}
          className="px-6 py-3 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          💬 Зв’язатися з психологом
        </button>
        
        <button 
          onClick={() => alert("Кейс відкрито в системі")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-medium transition-colors"
        >
          Відкрити повний кейс
        </button>
        
        <button 
          onClick={() => alert("Дані експортовано")}
          className="px-6 py-3 border border-gray-600 hover:bg-gray-800 rounded-2xl font-medium transition-colors"
        >
          📄 Експорт у PDF
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-8 text-center">
        Дані анонімізовані • Інтеграція з державними реєстрами (MVP)
      </div>
    </div>
  );
};

export default ChildProfile;

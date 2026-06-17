// frontend-dashboard/src/components/RegistryFusion.tsx
import React from 'react';
import { School, Heart, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface RegistryFusionProps {
  childId?: string;
  data?: any;
}

const RegistryFusion: React.FC<RegistryFusionProps> = ({ childId, data }) => {
  // Демо-дані з державних реєстрів
  const registryData = data || {
    school_grades_trend: "declining",
    recent_absences: 7,
    family_status: "divorce_recent",
    medical_visits_last_month: 3,
    known_risks: ["possible_bullying", "family_stress", "academic_decline"]
  };

  const fusedScore = data?.fused_risk_score || 0.87;

  const getTrendColor = (trend: string) => {
    if (trend === "declining") return "text-red-500";
    if (trend === "improving") return "text-green-500";
    return "text-yellow-500";
  };

  const insights = [
    {
      icon: <School className="w-5 h-5" />,
      title: "Освітній реєстр",
      content: "Падіння оцінок + 7 пропусків за місяць",
      impact: "Високий",
      color: "red"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Соціальні служби",
      content: "Нещодавнє розлучення батьків",
      impact: "Критичний",
      color: "orange"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Медичний реєстр",
      content: "3 візити за місяць (соматичні скарги)",
      impact: "Середній",
      color: "yellow"
    }
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Інтеграція реєстрів</h2>
          <p className="text-gray-400 text-sm">Interagency Data Fusion</p>
        </div>
      </div>

      {/* Fused Risk Score */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-2xl p-6 mb-8">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">ЗАГАЛЬНИЙ ІНДЕКС РИЗИКУ (AI + Реєстри)</div>
          <div className="text-6xl font-bold text-white mb-1">
            {(fusedScore * 100).toFixed(0)}%
          </div>
          <div className="inline-block px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-full">
            CRITICAL
          </div>
        </div>
      </div>

      {/* Registry Sources */}
      <div className="space-y-6 flex-1">
        {insights.map((item, index) => (
          <div key={index} className="flex gap-5 items-start bg-gray-800/50 rounded-2xl p-5 hover:bg-gray-800 transition-colors">
            <div className="mt-1 text-blue-400">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">{item.title}</div>
              <div className="text-gray-300 mt-1 text-[15px]">
                {item.content}
              </div>
              
              <div className={`mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-1 rounded-full border ${
                item.color === 'red' ? 'border-red-500 text-red-400' :
                item.color === 'orange' ? 'border-orange-500 text-orange-400' : 
                'border-yellow-500 text-yellow-400'
              }`}>
                {item.impact} вплив
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI + Registry Correlation */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="flex items-center gap-2 text-amber-400 mb-3">
          <AlertTriangle size={18} />
          <span className="font-semibold text-sm">Ключові інсайти</span>
        </div>
        
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex gap-3">
            <span className="text-green-400">•</span>
            Сигнали від Аватара (страх дому) сильно корелюють з розлученням батьків
          </li>
          <li className="flex gap-3">
            <span className="text-green-400">•</span>
            Падіння оцінок + низька енергія = високий ризик депресії
          </li>
          <li className="flex gap-3">
            <span className="text-green-400">•</span>
            Рекомендується негайна перевірка соціальними службами
          </li>
        </ul>
      </div>

      <div className="text-[10px] text-gray-500 mt-auto pt-6 text-center">
        Дані з eKool / Мрія • Єдиний соціальний реєстр • Медична база • Анонімізовано
      </div>
    </div>
  );
};

export default RegistryFusion;

// frontend-dashboard/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import AlertsPanel from '../components/AlertsPanel';
import RiskTimeline from '../components/RiskTimeline';
import ChildProfile from '../components/ChildProfile';
import RegistryFusion from '../components/RegistryFusion';
import { useDashboardStore } from '../store/useDashboardStore';

const Dashboard: React.FC = () => {
  const { selectedChild, setSelectedChild, children } = useDashboardStore();
  const [demoData, setDemoData] = useState<any>(null);

  useEffect(() => {
    // Завантаження демо-даних
    fetch('/demo_data.json') // або з API
      .then(res => res.json())
      .then(data => {
        setDemoData(data);
        if (!selectedChild && data) setSelectedChild(data.child_session_id);
      })
      .catch(() => {
        // fallback
        console.log("Використовуємо вбудовані демо-дані");
      });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col">
        <DashboardHeader />
        <AlertsPanel />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <ChildProfile childId={selectedChild} data={demoData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <RiskTimeline childId={selectedChild} />
            <RegistryFusion childId={selectedChild} data={demoData?.registry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

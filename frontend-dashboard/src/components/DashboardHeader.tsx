// frontend-dashboard/src/components/DashboardHeader.tsx
import React from 'react';
import { LogOut, Settings, Bell, User } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const DashboardHeader: React.FC = () => {
  const { selectedChild } = useDashboardStore();

  return (
    <div className="border-b border-gray-800 bg-gray-900 px-6 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
            🛡️
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ChildGuard AI</h1>
            <p className="text-xs text-gray-400 -mt-1">Interagency Protection System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Current Child Info */}
        {selectedChild && (
          <div className="hidden md:flex items-center gap-3 bg-gray-800 rounded-2xl px-4 py-2">
            <div className="w-7 h-7 bg-purple-500 rounded-xl flex items-center justify-center text-sm">
              👦
            </div>
            <div className="text-sm">
              <div className="font-medium">Дитина в роботі</div>
              <div className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                {selectedChild}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-3 hover:bg-gray-800 rounded-2xl transition-colors group">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
            3
          </div>
        </button>

        {/* Settings */}
        <button className="p-3 hover:bg-gray-800 rounded-2xl transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="text-right">
            <div className="text-sm font-medium">Анна Ковальчук</div>
            <div className="text-xs text-emerald-400">Психолог • Служба у справах дітей</div>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-lg">
            👩‍⚕️
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => alert("Вихід з системи (демо)")}
          className="p-3 hover:bg-red-900/30 hover:text-red-400 rounded-2xl transition-all text-gray-400 hover:text-red-400"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

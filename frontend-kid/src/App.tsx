// frontend-kid/src/App.tsx

import React from 'react';
import AvatarChat from './components/AvatarChat';
import './App.css'; // Якщо потрібно глобальні стилі

function App() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(at_bottom_left,#7c3aed20_0%,transparent_50%)]"></div>

      <div className="relative z-10">
        {/* Top Navigation / Header */}
        <header className="bg-black/70 backdrop-blur-md border-b border-white/10 py-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
                👹
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Монстрик</h1>
                <p className="text-xs text-purple-400 -mt-1">твій друг і захисник</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1 bg-white/10 rounded-full text-purple-300">
                Демо Хакатон 2026
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-lg cursor-pointer hover:bg-white/20 transition-colors">
                👤
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <AvatarChat />
        </main>

        {/* Footer */}
        <footer className="max-w-2xl mx-auto px-6 py-8 text-center text-purple-400 text-xs border-t border-white/10 mt-12">
          <p>Interagency Child Protection Ecosystem • Україна 🇺🇦 + Естонія 🇪🇪</p>
          <p className="mt-1">Всі дані анонімізовані • Базується на RCADS + PHQ-9</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

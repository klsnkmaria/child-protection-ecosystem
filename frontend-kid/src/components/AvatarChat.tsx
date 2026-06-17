// frontend-kid/src/components/AvatarChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { value: "very_good", label: "Супер!", emoji: "🚀", color: "#22c55e" },
  { value: "good", label: "Добре", emoji: "😊", color: "#4ade80" },
  { value: "neutral", label: "Норм", emoji: "😐", color: "#eab308" },
  { value: "low", label: "Не дуже", emoji: "😕", color: "#f97316" },
  { value: "very_low_energy", label: "Погано", emoji: "😢", color: "#ef4444" },
];

const AvatarChat: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [message, setMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
  };

  const sendLog = async () => {
    if (!message.trim() && currentMood === "neutral") return;

    setIsAnalyzing(true);

    const logData = {
      child_session_id: "demo_child_anon_748392",
      current_log: {
        mood_swipe: currentMood,
        text: message.trim(),
      },
      history_logs: logs.slice(-10),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/logs/analyze-and-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      });

      const result = await response.json();
      
      setLastAnalysis(result);
      setLogs(prev => [...prev, { ...logData.current_log, timestamp: new Date().toISOString() }]);
      
      // Зворотний зв'язок від монстрика
      console.log("✅ Аналіз отримано:", result);
      
    } catch (error) {
      console.error("Помилка відправки:", error);
      alert("Не вдалося з'єднатися з сервером. Перевірте, чи запущений backend.");
    } finally {
      setIsAnalyzing(false);
      setMessage("");
    }
  };

  const toggleVoiceInput = () => {
    // Для MVP — імітація. У реальності — Web Speech API
    setIsRecording(!isRecording);
    if (!isRecording) {
      alert("🎤 Голосовий ввід активовано (MVP: імітація). Напишіть текст.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen text-white p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce">👹</div>
        <h1 className="text-4xl font-bold mb-2">Привіт, я твій Монстрик!</h1>
        <p className="text-purple-200">Розкажи, як я сьогодні почуваюся?</p>
      </div>

      {/* Avatar Mood Display */}
      <div className="flex justify-center mb-8">
        <div 
          className="w-48 h-48 rounded-3xl flex items-center justify-center text-8xl shadow-2xl transition-all duration-500"
          style={{ backgroundColor: moodOptions.find(m => m.value === currentMood)?.color + '33' }}
        >
          {moodOptions.find(m => m.value === currentMood)?.emoji}
        </div>
      </div>

      {/* Mood Selector */}
      <div className="mb-8">
        <p className="text-center text-purple-200 mb-4">Як почувається твій монстрик?</p>
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`p-4 rounded-2xl text-center transition-all hover:scale-110 ${
                currentMood === mood.value 
                  ? 'ring-4 ring-white scale-110' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-4xl mb-1">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Що турбує монстрика сьогодні? (можна писати або говорити)"
          className="w-full bg-transparent border border-white/30 rounded-2xl p-4 text-lg placeholder:text-purple-300 focus:outline-none focus:border-white/50 min-h-[120px] resize-y"
          rows={4}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={toggleVoiceInput}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            {isRecording ? "Запис..." : "Говорити"}
          </button>

          <button
            onClick={sendLog}
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold disabled:opacity-70 transition-all"
          >
            <Send size={24} />
            {isAnalyzing ? "Аналізую..." : "Відправити"}
          </button>
        </div>
      </div>

      {/* Last Analysis Feedback */}
      {lastAnalysis && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mt-6">
          <h3 className="font-semibold mb-3 text-lg">💡 Що думає психолог:</h3>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            lastAnalysis.risk_level === 'CRITICAL' ? 'bg-red-500' :
            lastAnalysis.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
          }`}>
            Рівень ризику: {lastAnalysis.risk_level} ({(lastAnalysis.risk_score * 100).toFixed(0)}%)
          </div>
          <p className="text-purple-100 leading-relaxed">
            {lastAnalysis.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarChat;

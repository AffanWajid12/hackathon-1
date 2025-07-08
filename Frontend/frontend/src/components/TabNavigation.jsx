import { AudioLines, MessageSquare } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="max-w-2xl mx-auto mb-8">
    <div className="flex bg-[#1c1d1d] rounded-full p-2 border border-gray-800">
      <button
        onClick={() => setActiveTab('audio')}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
          activeTab === 'audio'
            ? 'bg-[#2e2f2f]'
            : 'text-[#babbbb] hover:text-white'
        }`}
      >
        <AudioLines className="w-5 h-5" />
        Audio Analysis
      </button>
      <button
        onClick={() => setActiveTab('text')}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
          activeTab === 'text'
           ? 'bg-[#2e2f2f]'
            : 'text-[#babbbb] hover:text-white'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        Text Analysis
      </button>
    </div>
  </div>
);

export default TabNavigation;
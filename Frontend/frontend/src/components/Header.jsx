import { Brain } from 'lucide-react';

const Header = () => (
  <div className="text-center py-6 pl-10">
    <div className="flex justify-left items-center gap-4 mb-4">
      {/* Brain Icon */}
      <div className="bg-black rounded-full">
        <Brain className="h-10 w-10" />
      </div>

      {/* Title with right border */}
      <div className="pr-4 border-r-[2px] border-[#272828]">
        <h1 className="text-2xl font-bold bg-indigo-400 bg-clip-text text-transparent">
          Emotion Analyzer
        </h1>
      </div>

      {/* Description */}
      <p className=" text-gray-300 max-w-2xl">
        Analyze emotions through voice or text using advanced AI
      </p>
    </div>
  </div>
);

export default Header;

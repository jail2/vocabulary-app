import { ChevronRight, Eye, BookOpen } from 'lucide-react';

const LectureSelector = ({ vocabularyData, onSelect, mode = 'tapToReveal' }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === 'tapToReveal' ? '학습할 강/연습문제 선택' : '복습할 강/연습문제 선택'}
        </h2>
        <div className="space-y-4">
          {Object.entries(vocabularyData).map(([lecture, exercises]) => (
            <div key={lecture} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-800">
                {lecture}
              </div>
              <div className="divide-y divide-gray-100">
                {Object.entries(exercises).map(([exercise, words]) => (
                  <button
                    key={`${lecture}-${exercise}`}
                    onClick={() => onSelect({ lecture, exercise, words })}
                    className="w-full px-4 py-4 flex justify-between items-center hover:bg-blue-50 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      {mode === 'tapToReveal' ? (
                        <Eye className="text-blue-600" size={20} />
                      ) : (
                        <BookOpen className="text-green-600" size={20} />
                      )}
                      <span className="font-medium text-gray-800">{exercise}</span>
                      <span className="text-sm text-gray-500">({words.length}개 단어)</span>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureSelector;

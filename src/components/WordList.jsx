import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';

const WordList = ({ words, wordStates }) => {
  const [selectedLecture, setSelectedLecture] = useState('전체');
  const [selectedExercise, setSelectedExercise] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const lectures = ['전체', ...new Set(words.map(w => w.lecture))];
  const exercises = selectedLecture === '전체' 
    ? ['전체'] 
    : ['전체', ...new Set(words.filter(w => w.lecture === selectedLecture).map(w => w.exercise))];

  const filteredWords = words.filter(word => {
    const matchesLecture = selectedLecture === '전체' || word.lecture === selectedLecture;
    const matchesExercise = selectedExercise === '전체' || word.exercise === selectedExercise;
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.includes(searchTerm);
    return matchesLecture && matchesExercise && matchesSearch;
  });

  const getBoxColor = (box) => {
    const colors = {
      1: 'bg-gray-200',
      2: 'bg-blue-200',
      3: 'bg-green-200',
      4: 'bg-yellow-200',
      5: 'bg-purple-200'
    };
    return colors[box] || 'bg-gray-200';
  };

  const getBoxLabel = (box) => {
    const labels = {
      1: '새로운 단어',
      2: '1일 후',
      3: '3일 후',
      4: '1주 후',
      5: '완료'
    };
    return labels[box] || '새로운 단어';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen size={28} />
          단어 목록
        </h2>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="단어 또는 뜻으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedLecture}
              onChange={(e) => {
                setSelectedLecture(e.target.value);
                setSelectedExercise('전체');
              }}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {lectures.map(lecture => (
                <option key={lecture} value={lecture}>{lecture}</option>
              ))}
            </select>

            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              disabled={selectedLecture === '전체'}
            >
              {exercises.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredWords.map(word => {
            const state = wordStates[word.id];
            return (
              <div
                key={word.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{word.lecture}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{word.exercise}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-600">{word.word}</h3>
                    <p className="text-gray-700">{word.meaning}</p>
                  </div>
                  {state && (
                    <div className="ml-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBoxColor(state.box)}`}>
                        {getBoxLabel(state.box)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        정답: {state.correctCount} | 오답: {state.incorrectCount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-center text-gray-500 text-sm">
          총 {filteredWords.length}개의 단어
        </div>
      </div>
    </div>
  );
};

export default WordList;

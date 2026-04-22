import { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

const Quiz = ({ words, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentWord = words[currentIndex];
  const options = generateOptions(currentWord, words);

  function generateOptions(currentWord, allWords) {
    const correctAnswer = currentWord;
    const otherWords = allWords.filter(w => w.id !== currentWord.id);
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctAnswer, ...shuffled].sort(() => Math.random() - 0.5);
    return options;
  }

  const handleAnswer = (option) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    
    const isCorrect = option.id === currentWord.id;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, { word: currentWord, selected: option, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete({ score, total: words.length, answers });
    }
  };

  const getOptionStyle = (option) => {
    if (!showResult) {
      return selectedAnswer === option 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300';
    }
    if (option.id === currentWord.id) {
      return 'border-green-500 bg-green-50';
    }
    if (selectedAnswer === option && option.id !== currentWord.id) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-gray-200';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-gray-600">
          문제 {currentIndex + 1} / {words.length}
        </span>
        <span className="text-blue-600 font-semibold">
          점수: {score}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-2">{currentWord.lecture} - {currentWord.exercise}</p>
          <h2 className="text-3xl font-bold text-gray-800">{currentWord.meaning}</h2>
          <p className="text-gray-500 mt-2">이 뜻에 해당하는 영어 단어를 선택하세요</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className={`p-4 border-2 rounded-lg text-center transition ${
                getOptionStyle(option)
              } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-lg font-semibold">{option.word}</span>
            </button>
          ))}
        </div>

        {showResult && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          >
            {currentIndex < words.length - 1 ? '다음 문제' : '결과 보기'}
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;

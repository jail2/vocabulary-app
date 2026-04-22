import { useState } from 'react';
import { RotateCw, Check, X, ArrowRight } from 'lucide-react';

const Flashcard = ({ word, onNext, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === word.word.toLowerCase();
    setAnswered(true);
    onAnswer(word.id, isCorrect);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setAnswered(false);
    setUserAnswer('');
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col justify-center items-center">
        {!isFlipped && !answered ? (
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">{word.lecture} - {word.exercise}</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{word.meaning}</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="영어 단어를 입력하세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-center text-xl"
                autoFocus
              />
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                확인
              </button>
            </form>
            <button
              onClick={handleFlip}
              className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
            >
              <RotateCw size={20} />
              카드 뒤집기
            </button>
          </div>
        ) : (
          <div className="text-center">
            {answered && (
              <div className={`mb-4 flex items-center justify-center gap-2 ${userAnswer.toLowerCase().trim() === word.word.toLowerCase() ? 'text-green-600' : 'text-red-600'}`}>
                {userAnswer.toLowerCase().trim() === word.word.toLowerCase() ? <Check size={24} /> : <X size={24} />}
                <span className="font-semibold">
                  {userAnswer.toLowerCase().trim() === word.word.toLowerCase() ? '정답!' : '오답'}
                </span>
              </div>
            )}
            <p className="text-gray-500 text-sm mb-2">{word.lecture} - {word.exercise}</p>
            <h2 className="text-4xl font-bold text-blue-600 mb-4">{word.word}</h2>
            <p className="text-2xl text-gray-700 mb-8">{word.meaning}</p>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2 mx-auto"
            >
              다음 단어
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;

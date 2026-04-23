import { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const TapToReveal = ({ words, lecture, exercise, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [shuffled, setShuffled] = useState(() => [...words].sort(() => Math.random() - 0.5));
  const [showGridView, setShowGridView] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const currentWord = shuffled[currentIndex];

  const handleNext = () => {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowMeaning(false);
    }
  };

  const handleReshuffle = () => {
    setShuffled([...words].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setShowMeaning(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKeys(prev => new Set(prev).add(e.key.toLowerCase()));

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setShowMeaning(!showMeaning);
      }
    };

    const handleKeyUp = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentIndex, showMeaning]);

  useEffect(() => {
    if (pressedKeys.has('q') && pressedKeys.has('p')) {
      setShowGridView(true);
    }
  }, [pressedKeys]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← 뒤로 가기
      </button>

      {showGridView ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{lecture}</p>
              <p className="text-sm text-gray-500">{exercise}</p>
            </div>
            <button
              onClick={() => setShowGridView(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              닫기
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shuffled.map((word, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 50}ms forwards`,
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                <p className="text-xl font-bold text-blue-600 mb-1">{word.word}</p>
                {word.partOfSpeech && (
                  <p className="text-xs text-purple-600 mb-2 font-medium">{word.partOfSpeech}</p>
                )}
                <p className="text-sm text-gray-700">{word.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">{lecture}</p>
            <p className="text-sm text-gray-500">{exercise}</p>
          </div>
          <button
            onClick={handleReshuffle}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            title="순서 섞기"
          >
            <RotateCw size={20} />
            섞기
          </button>
          </div>

        <div className="text-center mb-4">
          <span className="text-gray-600">
            {currentIndex + 1} / {shuffled.length}
          </span>
        </div>

        <div
          onClick={() => setShowMeaning(!showMeaning)}
          className="min-h-[300px] flex flex-col justify-center items-center cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition p-8"
        >
          <div className="text-center">
            <p className="text-5xl font-bold text-blue-600 mb-2">{currentWord.word}</p>
            {currentWord.partOfSpeech && (
              <p className="text-sm text-purple-600 mb-4 font-medium">{currentWord.partOfSpeech}</p>
            )}
            
            {showMeaning ? (
              <>
                <div className="w-16 h-1 bg-gray-300 mx-auto mb-4" />
                <p className="text-3xl text-gray-800">{currentWord.meaning}</p>
                <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <EyeOff size={16} />
                  다시 탭하여 숨기기
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <Eye size={16} />
                탭하여 뜻 보기
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            이전
          </button>

          <div className="flex gap-2">
            {[...Array(Math.min(10, shuffled.length))].map((_, i) => {
              const dotIndex = Math.floor((currentIndex / shuffled.length) * 10);
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === dotIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === shuffled.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default TapToReveal;

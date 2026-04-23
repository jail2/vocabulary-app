import { useState, useRef } from 'react';
import { ChevronLeft, CheckCircle, XCircle, RotateCw } from 'lucide-react';

const WrittenTest = ({ words, onComplete, onBack }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const inputRefs = useRef([]);

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value.trim()
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === ' ' && index < words.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const gradedResults = words.map((word, index) => {
      const userAnswer = answers[index] || '';
      const correctAnswer = word.meaning;
      
      // Simple matching - check if user answer contains key parts of the correct meaning
      // This is a basic implementation that can be improved
      const isCorrect = userAnswer.length > 0 && 
        (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer.split(',')[0].trim()));
      
      return {
        word,
        userAnswer,
        correctAnswer,
        isCorrect
      };
    });

    const score = gradedResults.filter(r => r.isCorrect).length;
    setResults({ answers: gradedResults, score, total: words.length });
    setSubmitted(true);
    onComplete({ answers: gradedResults, score, total: words.length });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  if (submitted && results) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← 뒤로 가기
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">시험 결과</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {results.score} / {results.total}
              </p>
              <p className="text-gray-600">
                정답률: {Math.round((results.score / results.total) * 100)}%
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {results.answers.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                  ) : (
                    <XCircle className="text-red-600 mt-1" size={20} />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{result.word.word}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      내 답: <span className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                        {result.userAnswer || '(비워둠)'}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-sm text-gray-600 mt-1">
                        정답: <span className="text-green-700">{result.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
            >
              <RotateCw size={20} />
              다시 풀기
            </button>
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← 뒤로 가기
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">서술형 시험</h2>
          <p className="text-gray-600">
            {Object.keys(answers).filter(k => answers[k].length > 0).length} / {words.length} 답변 완료
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {words.map((word, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-800 mb-2">{word.word}</p>
                  <input
                    type="text"
                    ref={el => inputRefs.current[index] = el}
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="한국어 뜻을 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length === 0}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          채점하기
        </button>
      </div>
    </div>
  );
};

export default WrittenTest;

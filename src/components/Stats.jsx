import { Trophy, Target, TrendingUp, RotateCcw } from 'lucide-react';

const Stats = ({ stats, onReset }) => {
  const accuracy = stats.totalCorrect + stats.totalIncorrect > 0
    ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100)
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Trophy size={28} />
          학습 통계
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Target className="mx-auto mb-2 text-blue-600" size={32} />
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">전체 단어</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Trophy className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-3xl font-bold text-green-600">{stats.mastered}</p>
            <p className="text-sm text-gray-600">완료</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <TrendingUp className="mx-auto mb-2 text-yellow-600" size={32} />
            <p className="text-3xl font-bold text-yellow-600">{stats.learning}</p>
            <p className="text-sm text-gray-600">학습 중</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Target className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="text-3xl font-bold text-gray-600">{stats.newWords}</p>
            <p className="text-sm text-gray-600">새로운 단어</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">정답률</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">{accuracy}%</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>정답: {stats.totalCorrect}</span>
            <span>오답: {stats.totalIncorrect}</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          진행률 초기화
        </button>
      </div>
    </div>
  );
};

export default Stats;

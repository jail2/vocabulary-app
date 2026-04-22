import { useState } from 'react';
import { BookOpen, Brain, List, BarChart3, Home, CheckCircle, Layers, PenTool } from 'lucide-react';
import { getAllWords, vocabularyData } from './vocabularyData';
import { useSpacedRepetition } from './useSpacedRepetition';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import WordList from './components/WordList';
import Stats from './components/Stats';
import LectureSelector from './components/LectureSelector';
import TapToReveal from './components/TapToReveal';
import WrittenTest from './components/WrittenTest';

const allWords = getAllWords();

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [quizWords, setQuizWords] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [selectedStudySet, setSelectedStudySet] = useState(null);
  const [writtenTestWords, setWrittenTestWords] = useState([]);
  
  const { wordStates, updateWordState, getDueWords, getStats, resetProgress } = useSpacedRepetition(allWords);
  const dueWords = getDueWords();
  const stats = getStats();

  const handleFlashcardAnswer = (wordId, isCorrect) => {
    updateWordState(wordId, isCorrect);
  };

  const handleFlashcardNext = () => {
    if (flashcardIndex < dueWords.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setCurrentView('home');
      setFlashcardIndex(0);
    }
  };

  const startQuiz = (count = 10) => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setQuizWords(shuffled.slice(0, Math.min(count, shuffled.length)));
    setQuizResults(null);
    setCurrentView('quiz');
  };

  const startWrittenTest = (count = 25) => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setWrittenTestWords(shuffled.slice(0, Math.min(count, shuffled.length)));
    setCurrentView('writtenTest');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    results.answers.forEach(answer => {
      updateWordState(answer.word.id, answer.correct);
    });
  };

  const handleWrittenTestComplete = (results) => {
    results.answers.forEach(answer => {
      const fullWord = allWords.find(w => w.word === answer.word.word);
      if (fullWord) {
        updateWordState(fullWord.id, answer.isCorrect);
      }
    });
  };

  const handleSelectStudySet = ({ lecture, exercise, words }) => {
    setSelectedStudySet({ lecture, exercise, words });
    setCurrentView('tapToReveal');
  };

  const handleSelectReviewSet = ({ lecture, exercise, words }) => {
    setSelectedStudySet({ lecture, exercise, words });
    setFlashcardIndex(0);
    setCurrentView('flashcardReview');
  };

  const NavButton = ({ view, icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-lg transition ${
        currentView === view 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon size={24} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="text-blue-600" size={32} />
            영단어 암기 앱
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 학습</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">복습 필요한 단어</p>
                  <p className="text-3xl font-bold text-blue-600">{dueWords.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">완료한 단어</p>
                  <p className="text-3xl font-bold text-green-600">{stats.mastered}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">정답률</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalCorrect + stats.totalIncorrect > 0 
                      ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  if (dueWords.length > 0) {
                    setFlashcardIndex(0);
                    setCurrentView('flashcard');
                  }
                }}
                disabled={dueWords.length === 0}
                className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BookOpen className="text-blue-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">플래시카드 학습</h3>
                <p className="text-gray-600 mb-4">스페이싱 반복으로 효과적으로 암기하세요</p>
                <p className="text-sm text-blue-600 font-semibold">
                  {dueWords.length > 0 ? `${dueWords.length}개의 단어 복습` : '복습할 단어가 없습니다'}
                </p>
              </button>

              <button
                onClick={() => startQuiz(10)}
                className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition"
              >
                <Brain className="text-purple-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">퀴즈 모드</h3>
                <p className="text-gray-600 mb-4">객관식 문제로 실력을 테스트하세요</p>
                <p className="text-sm text-purple-600 font-semibold">10개 랜덤 문제</p>
              </button>

              <button
                onClick={() => startWrittenTest(25)}
                className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition"
              >
                <PenTool className="text-orange-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">서술형 시험</h3>
                <p className="text-gray-600 mb-4">직접 뜻을 입력하여 실력을 테스트하세요</p>
                <p className="text-sm text-orange-600 font-semibold">25개 랜덤 문제</p>
              </button>

              <button
                onClick={() => setCurrentView('lectureSelector')}
                className="bg-white rounded-2xl shadow-xl p-6 text-left hover:shadow-2xl transition"
              >
                <Layers className="text-green-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">강별 학습</h3>
                <p className="text-gray-600 mb-4">특정 강/연습문제 단어만 학습</p>
                <p className="text-sm text-green-600 font-semibold">영어 → 한국어 탭으로 확인</p>
              </button>
            </div>

            {quizResults && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                  <h3 className="text-xl font-bold text-gray-800">퀴즈 결과</h3>
                </div>
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-blue-600 mb-2">
                    {quizResults.score} / {quizResults.total}
                  </p>
                  <p className="text-gray-600">
                    정답률: {Math.round((quizResults.score / quizResults.total) * 100)}%
                  </p>
                </div>
                <button
                  onClick={() => startQuiz(10)}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  다시 풀기
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'flashcard' && dueWords.length > 0 && (
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← 홈으로
            </button>
            <Flashcard
              word={dueWords[flashcardIndex]}
              onNext={handleFlashcardNext}
              onAnswer={handleFlashcardAnswer}
            />
            <div className="text-center mt-4 text-gray-600">
              {flashcardIndex + 1} / {dueWords.length}
            </div>
          </div>
        )}

        {currentView === 'quiz' && quizWords.length > 0 && (
          <div>
            <button
              onClick={() => setCurrentView('home')}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← 홈으로
            </button>
            <Quiz words={quizWords} onComplete={handleQuizComplete} />
          </div>
        )}

        {currentView === 'writtenTest' && writtenTestWords.length > 0 && (
          <WrittenTest
            words={writtenTestWords}
            onComplete={handleWrittenTestComplete}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'wordlist' && (
          <WordList words={allWords} wordStates={wordStates} />
        )}

        {currentView === 'stats' && (
          <Stats stats={stats} onReset={resetProgress} />
        )}

        {currentView === 'lectureSelector' && (
          <LectureSelector vocabularyData={vocabularyData} onSelect={handleSelectStudySet} mode="tapToReveal" />
        )}

        {currentView === 'reviewSelector' && (
          <LectureSelector vocabularyData={vocabularyData} onSelect={handleSelectReviewSet} mode="flashcard" />
        )}

        {currentView === 'tapToReveal' && selectedStudySet && (
          <TapToReveal
            words={selectedStudySet.words}
            lecture={selectedStudySet.lecture}
            exercise={selectedStudySet.exercise}
            onBack={() => setCurrentView('lectureSelector')}
          />
        )}

        {currentView === 'flashcardReview' && selectedStudySet && (
          <div>
            <button
              onClick={() => setCurrentView('reviewSelector')}
              className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← 뒤로 가기
            </button>
            <Flashcard
              word={selectedStudySet.words[flashcardIndex]}
              onNext={() => {
                if (flashcardIndex < selectedStudySet.words.length - 1) {
                  setFlashcardIndex(prev => prev + 1);
                } else {
                  setCurrentView('reviewSelector');
                  setFlashcardIndex(0);
                }
              }}
              onAnswer={(wordId, isCorrect) => {
                const wordWithId = selectedStudySet.words[flashcardIndex];
                const fullWord = allWords.find(w => w.word === wordWithId.word);
                if (fullWord) {
                  updateWordState(fullWord.id, isCorrect);
                }
              }}
            />
            <div className="text-center mt-4 text-gray-600">
              {flashcardIndex + 1} / {selectedStudySet.words.length}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-around">
            <NavButton view="home" icon={Home} label="홈" onClick={() => setCurrentView('home')} />
            <NavButton view="lectureSelector" icon={Layers} label="강별 학습" onClick={() => setCurrentView('lectureSelector')} />
            <NavButton view="flashcard" icon={BookOpen} label="복습" onClick={() => setCurrentView('reviewSelector')} />
            <NavButton view="quiz" icon={Brain} label="퀴즈" onClick={() => startQuiz(10)} />
            <NavButton view="writtenTest" icon={PenTool} label="시험" onClick={() => startWrittenTest(25)} />
            <NavButton view="wordlist" icon={List} label="단어장" onClick={() => setCurrentView('wordlist')} />
            <NavButton view="stats" icon={BarChart3} label="통계" onClick={() => setCurrentView('stats')} />
          </div>
        </div>
      </nav>

      <div className="h-20" />
    </div>
  );
}

export default App;

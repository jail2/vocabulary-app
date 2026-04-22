import { useState, useEffect } from 'react';

const LEITNER_BOXES = {
  1: { interval: 1, label: '새로운 단어' },
  2: { interval: 3, label: '1일 후' },
  3: { interval: 7, label: '3일 후' },
  4: { interval: 14, label: '1주 후' },
  5: { interval: 30, label: '2주 후' }
};

export const useSpacedRepetition = (words) => {
  const [wordStates, setWordStates] = useState(() => {
    const saved = localStorage.getItem('wordStates');
    if (saved) {
      return JSON.parse(saved);
    }
    const initialStates = {};
    words.forEach(word => {
      initialStates[word.id] = {
        box: 1,
        nextReview: new Date().toISOString(),
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null
      };
    });
    return initialStates;
  });

  useEffect(() => {
    localStorage.setItem('wordStates', JSON.stringify(wordStates));
  }, [wordStates]);

  const updateWordState = (wordId, isCorrect) => {
    setWordStates(prev => {
      const current = prev[wordId] || { box: 1, correctCount: 0, incorrectCount: 0 };
      let newBox = current.box;
      
      if (isCorrect) {
        newBox = Math.min(current.box + 1, 5);
      } else {
        newBox = Math.max(current.box - 1, 1);
      }

      const interval = LEITNER_BOXES[newBox].interval;
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      return {
        ...prev,
        [wordId]: {
          ...current,
          box: newBox,
          nextReview: nextReview.toISOString(),
          correctCount: isCorrect ? current.correctCount + 1 : current.correctCount,
          incorrectCount: isCorrect ? current.incorrectCount : current.incorrectCount + 1,
          lastReviewed: new Date().toISOString()
        }
      };
    });
  };

  const getDueWords = () => {
    const now = new Date();
    return words.filter(word => {
      const state = wordStates[word.id];
      if (!state) return true;
      return new Date(state.nextReview) <= now;
    });
  };

  const getWordState = (wordId) => {
    return wordStates[wordId] || { box: 1, correctCount: 0, incorrectCount: 0 };
  };

  const getStats = () => {
    const total = words.length;
    const mastered = words.filter(w => wordStates[w.id]?.box === 5).length;
    const learning = words.filter(w => wordStates[w.id]?.box > 1 && wordStates[w.id]?.box < 5).length;
    const newWords = words.filter(w => !wordStates[w.id] || wordStates[w.id]?.box === 1).length;
    
    let totalCorrect = 0;
    let totalIncorrect = 0;
    Object.values(wordStates).forEach(state => {
      totalCorrect += state.correctCount;
      totalIncorrect += state.incorrectCount;
    });

    return { total, mastered, learning, newWords, totalCorrect, totalIncorrect };
  };

  const resetProgress = () => {
    localStorage.removeItem('wordStates');
    const initialStates = {};
    words.forEach(word => {
      initialStates[word.id] = {
        box: 1,
        nextReview: new Date().toISOString(),
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: null
      };
    });
    setWordStates(initialStates);
  };

  return { wordStates, updateWordState, getDueWords, getWordState, getStats, resetProgress };
};

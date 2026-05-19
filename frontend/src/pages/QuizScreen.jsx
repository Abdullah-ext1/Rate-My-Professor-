import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../context/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const QuizScreen = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selfMarked, setSelfMarked] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  const { data: quiz, isLoading, isError } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const res = await api.get(`/quiz/${quizId}`);
      return res.data.data;
    },
    staleTime: Infinity,
  });

  // Re-quiz mutation — generates new questions using saved source content
  const reQuizMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/quiz/requiz/${quizId}`);
      return res.data.data;
    },
    onSuccess: (newQuiz) => {
      navigate(`/quiz/${newQuiz._id}`, { replace: true });
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to generate new quiz');
    },
  });

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswerSubmit = () => {
    if (!currentQuestion) return;
    let isCorrect = false;
    let userAnswer = '';

    if (currentQuestion.type === 'mcq') {
      userAnswer = selectedOption;
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'one-word') {
      userAnswer = inputValue.trim();
      isCorrect = userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    } else if (currentQuestion.type === 'short-answer') {
      userAnswer = inputValue.trim();
      isCorrect = false;
    }

    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { userAnswer, isCorrect, selfMarked: null }
    }));
    setSubmitted(true);
  };

  const handleSkip = () => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { userAnswer: '', isCorrect: false, selfMarked: null, skipped: true }
    }));
    goToNext();
  };

  const handleSelfMark = (correct) => {
    setSelfMarked(correct);
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], isCorrect: correct, selfMarked: correct }
    }));
  };

  const goToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
      setInputValue('');
      setSelfMarked(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption(null);
    setSubmitted(false);
    setInputValue('');
    setSelfMarked(null);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const score = Object.values(answers).filter(a => a.isCorrect).length;
  const skipped = Object.values(answers).filter(a => a.skipped).length;
  const wrong = totalQuestions - score - skipped;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Color based on score
  const getScoreColor = () => {
    if (percentage >= 70) return '#22c55e'; // green
    if (percentage >= 40) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getMotivationalMessage = () => {
    if (percentage >= 90) return "🏆 Outstanding! You crushed it!";
    if (percentage >= 70) return "🔥 Great job! Keep it up!";
    if (percentage >= 50) return "👍 Not bad! Room for improvement.";
    if (percentage >= 30) return "📚 Keep studying, you'll get there!";
    return "💪 Don't give up! Try again!";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 bg-bg min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text2 font-syne animate-pulse text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="flex flex-col flex-1 bg-bg min-h-screen items-center justify-center px-6">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-lg font-bold text-text font-syne mb-2">Quiz not found</h2>
        <p className="text-sm text-text3 mb-6 text-center">This quiz may have been removed or the link is invalid.</p>
        <button onClick={() => navigate('/pyqs')} className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors cursor-pointer">
          Back to Vault
        </button>
      </div>
    );
  }

  // ===== SCORE SCREEN =====
  if (showResult) {
    const scoreColor = getScoreColor();
    const circumference = 2 * Math.PI * 52;
    const strokeDash = (percentage / 100) * circumference;

    return (
      <div className="flex flex-col flex-1 bg-bg min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-full max-w-sm text-center"
          >
            {/* Score ring with dynamic color */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={scoreColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference - strokeDash }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-syne" style={{ color: scoreColor }}>{percentage}%</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-text font-syne mb-1">{score} / {totalQuestions}</h2>
            <p className="text-sm text-text3 mb-4">correct answers</p>

            {/* Breakdown */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-text3">{score} correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-text3">{wrong} wrong</span>
              </div>
              {skipped > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-text3">{skipped} skipped</span>
                </div>
              )}
            </div>

            <p className="text-base font-semibold mb-8" style={{ color: scoreColor }}>{getMotivationalMessage()}</p>

            <div className="flex flex-col gap-3">
              {/* Retake same quiz */}
              <button
                onClick={handleRetake}
                className="w-full py-3 bg-bg2 text-text border border-border rounded-xl font-semibold text-sm hover:bg-border transition-colors cursor-pointer"
              >
                Retake This Quiz
              </button>
              {/* Re-quiz with NEW questions */}
              <button
                onClick={() => reQuizMutation.mutate()}
                disabled={reQuizMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {reQuizMutation.isPending ? 'Generating...' : 'New Quiz (Fresh Questions)'}
              </button>
              <button
                onClick={handleShare}
                className="w-full py-3 bg-bg2 text-text border border-border rounded-xl font-semibold text-sm hover:bg-border transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                {showCopied ? 'Link Copied!' : 'Share Quiz'}
              </button>
              <button
                onClick={() => navigate('/pyqs')}
                className="w-full py-3 text-text3 text-sm font-medium hover:text-text transition-colors cursor-pointer"
              >
                Back to Vault
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== QUESTION SCREEN =====
  return (
    <div className="flex flex-col flex-1 bg-bg min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-bg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('/pyqs')} className="text-text3 hover:text-text transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-text font-syne">{quiz.subjectName}</h1>
            <p className="text-[10px] text-text3">Sem {quiz.semester}</p>
          </div>
          <span className="text-xs font-semibold text-primary-mid bg-primary/10 px-2 py-1 rounded-full">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (submitted ? 1 : 0)) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-4 pt-6 pb-36 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Question type badge */}
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${
              currentQuestion.type === 'mcq' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              currentQuestion.type === 'one-word' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {currentQuestion.type === 'mcq' ? 'Multiple Choice' : currentQuestion.type === 'one-word' ? 'One Word' : 'Short Answer'}
            </span>

            {/* Question text */}
            <h2 className="text-base font-semibold text-text leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {/* MCQ Options */}
            {currentQuestion.type === 'mcq' && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = option === currentQuestion.correctAnswer;
                  let optionStyle = 'bg-bg2 border-border text-text hover:bg-border';

                  if (submitted) {
                    if (isCorrectOption) {
                      optionStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400';
                    } else if (isSelected && !isCorrectOption) {
                      optionStyle = 'bg-red-500/15 border-red-500/50 text-red-400 line-through';
                    } else {
                      optionStyle = 'bg-bg2 border-border text-text3 opacity-40';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-primary/10 border-primary/40 text-primary-mid';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !submitted && setSelectedOption(option)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${optionStyle} ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="font-bold opacity-50 w-5">{String.fromCharCode(65 + idx)}.</span>
                      <span className="flex-1">{option}</span>
                      {submitted && isCorrectOption && <span className="text-emerald-400 text-base">✓</span>}
                      {submitted && isSelected && !isCorrectOption && <span className="text-red-400 text-base">✗</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* One-word / Short-answer input */}
            {(currentQuestion.type === 'one-word' || currentQuestion.type === 'short-answer') && (
              <div className="flex flex-col gap-3">
                {currentQuestion.type === 'one-word' ? (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer..."
                    className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors disabled:opacity-60"
                    onKeyDown={(e) => e.key === 'Enter' && !submitted && inputValue.trim() && handleAnswerSubmit()}
                  />
                ) : (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer..."
                    rows={3}
                    className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors resize-none disabled:opacity-60"
                  />
                )}
              </div>
            )}

            {/* Feedback after submit */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex flex-col gap-3"
              >
                {/* MCQ feedback */}
                {currentQuestion.type === 'mcq' && (
                  <div className={`p-3 rounded-xl border ${answers[currentIndex]?.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <span className={`text-sm font-semibold ${answers[currentIndex]?.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {answers[currentIndex]?.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
                    </span>
                    {!answers[currentIndex]?.isCorrect && (
                      <p className="text-xs text-text3 mt-1">The correct answer is: <span className="text-emerald-400 font-semibold">{currentQuestion.correctAnswer}</span></p>
                    )}
                  </div>
                )}

                {/* One-word feedback */}
                {currentQuestion.type === 'one-word' && (
                  <div className={`p-3 rounded-xl border ${answers[currentIndex]?.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    {answers[currentIndex]?.isCorrect ? (
                      <span className="text-emerald-400 text-sm font-semibold">✓ Correct!</span>
                    ) : (
                      <>
                        <span className="text-red-400 text-sm font-semibold">✗ Wrong!</span>
                        <p className="text-xs text-text3 mt-1">Correct answer: <span className="text-emerald-400 font-semibold">{currentQuestion.correctAnswer}</span></p>
                      </>
                    )}
                  </div>
                )}

                {/* Short-answer self-evaluation */}
                {currentQuestion.type === 'short-answer' && (
                  <div className="p-3 rounded-xl border border-border bg-bg2">
                    <p className="text-xs text-text3 mb-2">Model answer:</p>
                    <p className="text-sm text-text font-medium mb-3">{currentQuestion.correctAnswer}</p>
                    {selfMarked === null ? (
                      <div className="flex gap-2">
                        <p className="text-xs text-text3 mr-2 self-center">How did you do?</p>
                        <button onClick={() => handleSelfMark(true)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors cursor-pointer">✓ Got it</button>
                        <button onClick={() => handleSelfMark(false)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer">✗ Missed it</button>
                      </div>
                    ) : (
                      <span className={`text-xs font-semibold ${selfMarked ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selfMarked ? '✓ Marked correct' : '✗ Marked incorrect'}
                      </span>
                    )}
                  </div>
                )}

                {/* Explanation — always shown after submit */}
                {currentQuestion.explanation && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary-mid mb-1">Why?</p>
                    <p className="text-xs text-text2 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border px-4 py-3 z-40">
        {!submitted ? (
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-5 py-3 bg-bg2 text-text3 border border-border rounded-xl font-semibold text-sm hover:bg-border transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={handleAnswerSubmit}
              disabled={
                (currentQuestion?.type === 'mcq' && !selectedOption) ||
                ((currentQuestion?.type === 'one-word' || currentQuestion?.type === 'short-answer') && !inputValue.trim())
              }
              className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <button
            onClick={goToNext}
            disabled={currentQuestion?.type === 'short-answer' && selfMarked === null}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
          >
            {currentIndex < totalQuestions - 1 ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;

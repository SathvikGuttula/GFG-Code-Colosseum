import { Question } from '../types/contest';

/**
 * Deterministic pseudo-random number generator using Mulberry32
 * Ensures that if a student refreshes their browser, they get the EXACT same
 * jumbled question sequence without their test being re-randomized mid-way.
 */
function createSeededRandom(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  return function () {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffles the questions array using the Fisher-Yates algorithm
 * seeded by the student's unique identifier (e.g. email or registration number).
 * All students receive the identical 25 questions, but in a unique jumbled order.
 */
export function getShuffledQuestionsForStudent(
  questions: Question[],
  studentSeed: string
): Question[] {
  const rng = createSeededRandom(studentSeed.toLowerCase().trim());
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Normalizes a short answer string for robust comparison:
 * - Converts to lower-case
 * - Removes excess whitespace, hyphens, and standard punctuation
 * - Normalizes Big-O notation variants (e.g., "O(1)", "o(1)", "O( 1 )")
 */
export function normalizeAnswer(ans: string): string {
  if (!ans) return '';
  return ans
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, ' ')
    .replace(/[()[\]{}]/g, '')
    .trim();
}

/**
 * Checks whether a student's answer matches the correct answer or any acceptable variants
 */
export function isAnswerCorrect(question: Question, studentAnswer: string): boolean {
  if (!studentAnswer || !studentAnswer.trim()) return false;

  if (question.type === 'mcq') {
    return question.correctAnswer.trim().toLowerCase() === studentAnswer.trim().toLowerCase();
  }

  // Short answer evaluation
  const normalizedStudent = normalizeAnswer(studentAnswer);
  const normalizedCorrect = normalizeAnswer(question.correctAnswer);

  if (normalizedStudent === normalizedCorrect) {
    return true;
  }

  // Check acceptable alternatives list
  if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
    for (const alt of question.acceptableAnswers) {
      if (normalizeAnswer(alt) === normalizedStudent) {
        return true;
      }
    }
  }

  // Special case for Big-O notation (e.g., student typed "o(1)" or "1" or "o1" or "o(log n)" or "logn")
  const strippedStudent = studentAnswer.toLowerCase().replace(/[^a-z0-9]/g, '');
  const strippedCorrect = question.correctAnswer.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (strippedStudent === strippedCorrect) {
    return true;
  }

  return false;
}

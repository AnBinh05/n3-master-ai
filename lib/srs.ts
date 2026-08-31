export enum Rating {
  AGAIN = 'AGAIN',
  HARD = 'HARD',
  GOOD = 'GOOD',
  EASY = 'EASY',
}

export enum CardStatus {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  REVIEW = 'REVIEW',
  GRADUATED = 'GRADUATED',
}

export interface SRSResult {
  newEaseFactor: number;
  newInterval: number; // in days
  newRepetitions: number;
  nextDueDate: Date;
  newStatus: CardStatus;
}

/**
 * Calculates the next SRS state based on Anki SM-2 Algorithm.
 * 
 * @param rating User assessment: AGAIN, HARD, GOOD, EASY
 * @param currentEaseFactor Current Ease Factor (default 2.5)
 * @param currentInterval Current Interval in days (default 0)
 * @param currentRepetitions Current consecutive successful reviews
 */
export function calculateSM2(
  rating: Rating | string,
  currentEaseFactor: number = 2.5,
  currentInterval: number = 0,
  currentRepetitions: number = 0
): SRSResult {
  let ef = currentEaseFactor;
  let interval = currentInterval;
  let repetitions = currentRepetitions;
  let status: CardStatus = CardStatus.LEARNING;

  switch (rating) {
    case Rating.AGAIN:
    case 'AGAIN': {
      // Failed card -> Reset repetitions, short interval (1 day), decrease ease factor
      repetitions = 0;
      interval = 1;
      ef = Math.max(1.3, ef - 0.2);
      status = CardStatus.LEARNING;
      break;
    }
    case Rating.HARD:
    case 'HARD': {
      // Hard review -> Slight increase in interval, lower ease factor
      ef = Math.max(1.3, ef - 0.15);
      if (repetitions === 0) {
        interval = 1;
      } else {
        interval = Math.max(1, Math.round(interval * 1.2));
      }
      status = CardStatus.REVIEW;
      break;
    }
    case Rating.GOOD:
    case 'GOOD': {
      // Good review -> Normal SM-2 progression
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      status = CardStatus.GRADUATED;
      break;
    }
    case Rating.EASY:
    case 'EASY': {
      // Easy review -> Increase ease factor and jump interval
      ef = Math.min(3.5, ef + 0.15);
      repetitions += 1;
      if (repetitions === 1) {
        interval = 4;
      } else if (repetitions === 2) {
        interval = 10;
      } else {
        interval = Math.round(interval * ef * 1.3);
      }
      status = CardStatus.GRADUATED;
      break;
    }
  }

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + interval);

  return {
    newEaseFactor: Number(ef.toFixed(2)),
    newInterval: interval,
    newRepetitions: repetitions,
    nextDueDate,
    newStatus: status,
  };
}

/**
 * Returns human-readable label for next review interval preview
 * e.g., "1d", "6d", "12d"
 */
export function getIntervalPreview(
  rating: Rating,
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number
): string {
  const result = calculateSM2(rating, currentEaseFactor, currentInterval, currentRepetitions);
  if (result.newInterval === 0) return '< 10m';
  if (result.newInterval === 1) return '1d';
  return `${result.newInterval}d`;
}

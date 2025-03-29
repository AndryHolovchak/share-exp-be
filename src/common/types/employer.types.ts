import { ReviewRatingCategory } from './review.types';

export const EmployerSourceEnum = ['work-ua'] as const;
export type EmployerSourceType = (typeof EmployerSourceEnum)[number];

export type EmployerAverageReviewRatings = Record<ReviewRatingCategory, number>;

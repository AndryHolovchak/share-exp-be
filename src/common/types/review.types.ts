export const RatingEnum = [0, 1, 2, 3, 4, 5] as const;
export type Rating = (typeof RatingEnum)[number];

export type ReviewRatingCategory =
  | 'salary_and_benefits'
  | 'work_life_balance'
  | 'justice_and_equality'
  | 'career_growth'
  | 'management';

export type ReviewRatings = Record<ReviewRatingCategory, Rating>;

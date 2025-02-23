export const RatingEnum = [1, 2, 3, 4, 5] as const;
export type Rating = (typeof RatingEnum)[number];

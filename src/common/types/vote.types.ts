export const VoteEnum = [1, -1] as const;
export type Vote = (typeof VoteEnum)[number];

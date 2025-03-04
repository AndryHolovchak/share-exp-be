export const VoteEnum = ['upvote', 'downvote'] as const;
export type Vote = (typeof VoteEnum)[number];

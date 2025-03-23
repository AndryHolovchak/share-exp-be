export const EmployerSourceEnum = ['work-ua'] as const;
export type EmployerSourceType = (typeof EmployerSourceEnum)[number];

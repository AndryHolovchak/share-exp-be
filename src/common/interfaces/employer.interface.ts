import { Employer } from '../database/schemas/employer.schema';

export interface IPopulatedEmployer extends Employer {
  totalReviews: number;
}

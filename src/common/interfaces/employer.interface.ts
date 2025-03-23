import { Employer } from '../database/schemas/employer.schema';
import { EmployerSourceType } from '../types/employer.types';

export interface IPopulatedEmployer extends Employer {
  totalReviews: number;
}

export interface IEmployerSource {
  type: EmployerSourceType;
  externalId: string;
}

export interface EmployerDetails {
  name: string;
  shortDescriptionHtml: string;
  // fullDescriptionHtml: string;
  categoryDescription: string;
  logoUrl?: string;
  website?: string;
}

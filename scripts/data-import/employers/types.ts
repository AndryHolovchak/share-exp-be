import { EmployerDetails } from '../../../src/common/interfaces/employer.interface';

export interface IEmployersSource {
  getEmployers: (page: number) => Promise<
    Array<{
      id: string;
      logoUrl?: string;
    }>
  >;
  getDetails: (id: string) => Promise<Omit<EmployerDetails, 'logoUrl'> | null>;
}

export interface JobPosting {
  id: number;
  title: string;
  companyName: string;
  description: string;
  datePosted: Date;
  status: JobStatus;
  jobType?: string;
  location?: string;
  salaryRange?: string;
  experienceLevel?: string;
  applicationsCount: number;
}

export enum JobStatus {
  Active = 0,
  Inactive = 1
}

export interface CreateJobRequest {
  title: string;
  companyName: string;
  description: string;
  jobType?: string;
  location?: string;
  salaryRange?: string;
  experienceLevel?: string;
}

export interface UpdateJobRequest extends CreateJobRequest {
  status: JobStatus;
}
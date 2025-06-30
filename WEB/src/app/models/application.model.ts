export interface Application {
  id: number;
  userId: number;
  userName: string;
  jobPostingId: number;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  submittedAt: Date;
  updatedAt?: Date;
}

export enum ApplicationStatus {
  Submitted = 0,
  SelectedForInterview = 1,
  Rejected = 2
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}
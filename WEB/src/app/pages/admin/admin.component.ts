import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { JobPosting, CreateJobRequest, UpdateJobRequest, JobStatus } from '../../models/job.model';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-screen flex bg-gray-50 font-sans text-gray-800">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-extrabold text-purple-600">Admin Panel</h1>
          <p class="text-gray-500 mt-1 text-sm">Manage jobs & applications</p>
        </div>
        <nav class="flex flex-col mt-6">
          <button
              (click)="activeTab = 'jobs'"
              [class.bg-purple-100]="activeTab === 'jobs'"
              class="text-left px-6 py-3 font-semibold text-lg hover:bg-purple-200 transition"
          >
            Jobs ({{ jobs.length }})
          </button>
          <button
              (click)="activeTab = 'applications'"
              [class.bg-purple-100]="activeTab === 'applications'"
              class="text-left px-6 py-3 font-semibold text-lg hover:bg-purple-200 transition"
          >
            Applications ({{ applications.length }})
          </button>
        </nav>
        
        
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-10">
        <!-- Jobs Tab -->
        <section *ngIf="activeTab === 'jobs'">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold">Job Postings</h2>
            <button
                (click)="showCreateJobForm = !showCreateJobForm"
                class="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
            >
              {{ showCreateJobForm ? 'Close Form' : 'New Job' }}
            </button>
          </div>

          <!-- Job Form Modal -->
          <div
              *ngIf="showCreateJobForm"
              class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <form
                [formGroup]="jobForm"
                (ngSubmit)="onSubmitJob()"
                class="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative"
            >
              <h3 class="text-2xl  font-semibold mb-6 text-purple-600">
                {{ editingJob ? 'Edit Job' : 'Create Job' }}
              </h3>
              <button
                  type="button"
                  (click)="cancelJobForm()"
                  class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  aria-label="Close form"
              >
                &times;
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    formControlName="title"
                    placeholder="Job Title"
                    class="form-input"
                />
                <input
                    formControlName="companyName"
                    placeholder="Company Name"
                    class="form-input"
                />
                <select formControlName="jobType" class="form-input">
                  <option value="" disabled selected>Job Type</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
                <input
                    formControlName="location"
                    placeholder="Location"
                    class="form-input"
                />
                <input
                    formControlName="salaryRange"
                    placeholder="Salary Range"
                    class="form-input"
                />
                <select formControlName="experienceLevel" class="form-input">
                  <option value="" disabled selected>Experience Level</option>
                  <option>Entry Level</option>
                  <option>Mid-Level</option>
                  <option>Senior Level</option>
                  <option>Executive</option>
                </select>
              </div>

              <textarea
                  formControlName="description"
                  rows="5"
                  placeholder="Job Description"
                  class="form-textarea mt-6"
              ></textarea>

              <div class="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    (click)="cancelJobForm()"
                    class="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    [disabled]="jobForm.invalid || submittingJob"
                    class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
                >
                  {{ submittingJob ? 'Saving...' : editingJob ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Job List -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article
                *ngFor="let job of jobs"
                class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-xl font-bold text-gray-800">{{ job.title }}</h3>
                <span
                    class="text-xs font-semibold px-3 py-2 rounded-full"
                    [ngClass]="job.status === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
              {{ job.status === 0 ? 'Active' : 'Inactive' }}
            </span>
              </div>
              <p class="text-gray-500 font-semibold">{{ job.companyName }}</p>
              <p class="text-gray-600 mb-3 line-clamp-3" [title]="job.description">{{ job.description }}</p>
              <div class="flex flex-wrap text-sm text-gray-500 gap-4">
                <span>{{ job.jobType }}</span>
                <span>{{ job.location }}</span>
                <span>{{ job.salaryRange }}</span>
                <span>{{ job.experienceLevel }}</span>
                <span>{{ job.applicationsCount }} applications</span>
                <span>Posted {{ formatDate(job.datePosted) }}</span>
              </div>
              <div class="mt-4 flex gap-4">
                <button
                    (click)="editJob(job)"
                    class="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Edit
                </button>
                <button
                    (click)="deleteJob(job.id)"
                    class="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </article>
          </div>
        </section>

        <!-- Applications Tab -->
        <section *ngIf="activeTab === 'applications'">
          <h2 class="text-3xl font-bold mb-8">Applications</h2>
          <div class="space-y-6">
            <article
                *ngFor="let app of applications"
                class="bg-white rounded-lg shadow p-6 flex justify-between items-center"
            >
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ app.jobTitle }}</h3>
                <p class="text-gray-500 font-semibold">{{ app.companyName }}</p>
                <p class="text-sm text-gray-600">
                  <strong>Applicant:</strong> {{ app.userName }}
                </p>
                <p class="text-sm text-gray-500">
                  Applied {{ formatDate(app.submittedAt) }}
                  <span *ngIf="app.updatedAt"> &middot; Updated {{ formatDate(app.updatedAt) }}</span>
                </p>
              </div>
              <div>
                <select
                    [value]="app.status"
                    (change)="updateApplicationStatus(app.id, +$any($event.target).value)"
                    class="form-input"
                >
                  <option [value]="0">Submitted</option>
                  <option [value]="1">Selected for Interview</option>
                  <option [value]="2">Rejected</option>
                </select>
              </div>
            </article>
          </div>
        </section>

        <!-- Loading Indicator -->
        <div
            *ngIf="loading"
            class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 z-50"
        >
          <div class="loader"></div>
        </div>
      </main>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab = 'jobs';
  jobs: JobPosting[] = [];
  applications: Application[] = [];
  loading = false;
  showCreateJobForm = false;
  editingJob: JobPosting | null = null;
  submittingJob = false;

  jobForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private jobService: JobService,
      private applicationService: ApplicationService
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      description: ['', Validators.required],
      jobType: [''],
      location: [''],
      salaryRange: [''],
      experienceLevel: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadApplications();
  }

  loadJobs(): void {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
      }
    });
  }

  onSubmitJob(): void {
    if (this.jobForm.valid) {
      this.submittingJob = true;

      const jobData = this.jobForm.value;

      if (this.editingJob) {
        // Update existing job
        const updateData: UpdateJobRequest = {
          ...jobData,
          status: this.editingJob.status
        };

        this.jobService.updateJob(this.editingJob.id, updateData).subscribe({
          next: () => {
            this.submittingJob = false;
            this.cancelJobForm();
            this.loadJobs();
          },
          error: (error) => {
            console.error('Error updating job:', error);
            this.submittingJob = false;
          }
        });
      } else {
        // Create new job
        this.jobService.createJob(jobData).subscribe({
          next: () => {
            this.submittingJob = false;
            this.cancelJobForm();
            this.loadJobs();
          },
          error: (error) => {
            console.error('Error creating job:', error);
            this.submittingJob = false;
          }
        });
      }
    }
  }

  editJob(job: JobPosting): void {
    this.editingJob = job;
    this.showCreateJobForm = true;
    this.jobForm.patchValue({
      title: job.title,
      companyName: job.companyName,
      description: job.description,
      jobType: job.jobType,
      location: job.location,
      salaryRange: job.salaryRange,
      experienceLevel: job.experienceLevel
    });
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.loadJobs();
        },
        error: (error) => {
          console.error('Error deleting job:', error);
        }
      });
    }
  }

  cancelJobForm(): void {
    this.showCreateJobForm = false;
    this.editingJob = null;
    this.jobForm.reset();
  }

  updateApplicationStatus(applicationId: number, status: ApplicationStatus): void {
    this.applicationService.updateApplicationStatus(applicationId, { status }).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (error) => {
        console.error('Error updating application status:', error);
      }
    });
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'Submitted';
      case ApplicationStatus.SelectedForInterview:
        return 'Selected for Interview';
      case ApplicationStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.SelectedForInterview:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.Rejected:
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  }

  formatDate(dateStr: string | Date): string {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString();
  }
}

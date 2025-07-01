import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { JobPosting, UpdateJobRequest } from '../../models/job.model';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white rounded-r-2xl shadow p-6 flex flex-col">
        <h1 class="text-2xl font-extrabold text-blue-600 mb-2">Owner</h1>
        <nav class="space-y-2">
          <button (click)="activeTab='jobs'" [class]="activeTab==='jobs'? 'w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg' : 'w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'">
            Jobs ({{ jobs.length }})
          </button>
          <button (click)="activeTab='applications'" [class]="activeTab==='applications'? 'w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg' : 'w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'">
            Applications ({{ applications.length }})
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <section class="flex-1 p-8 space-y-8">
        <!-- Header & New Job Button -->
        <div *ngIf="activeTab==='jobs'" class="flex justify-between items-center">
          <h2 class="text-3xl font-bold text-gray-900">Job Postings</h2>
          <button (click)="showCreateJobForm=!showCreateJobForm" class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition">
            {{ showCreateJobForm?'Close Form':'New Job' }}
          </button>
        </div>

        <!-- Job Form Modal -->
        <div *ngIf="showCreateJobForm" class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start mt-20 z-50">
          <form [formGroup]="jobForm" (ngSubmit)="onSubmitJob()" class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
            <h3 class="text-2xl font-semibold text-blue-600 mb-4">{{ editingJob?'Edit Job':'Create Job' }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input formControlName="title" placeholder="Job Title" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2" />
              <input formControlName="companyName" placeholder="Company Name" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2" />
              <select formControlName="jobType" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2">
                <option value="" disabled>Job Type</option>
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
              </select>
              <input formControlName="location" placeholder="Location" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2" />
              <input formControlName="salaryRange" placeholder="Salary Range" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2" />
              <select formControlName="experienceLevel" class="form-input bg-gray-50 border-gray-300 rounded-lg p-2">
                <option value="" disabled>Experience Level</option>
                <option>Entry Level</option><option>Mid-Level</option><option>Senior Level</option><option>Executive</option>
              </select>
            </div>
            <textarea formControlName="description" rows="4" placeholder="Description" class="form-textarea bg-gray-50 border-gray-300 rounded-lg p-2 mt-4 w-full"></textarea>
            <div class="flex justify-end space-x-4 mt-6">
              <button type="button" (click)="cancelJobForm()" class="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100">Cancel</button>
              <button type="submit" [disabled]="jobForm.invalid||submittingJob" class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500">
                {{ submittingJob?(editingJob?'Updating...':'Saving...'):(editingJob?'Update':'Create') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Jobs List -->
        <div *ngIf="activeTab==='jobs'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article *ngFor="let job of jobs" class="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ job.title }}</h3>
            <p class="text-sm text-gray-500">{{ job.companyName }} • {{ job.location }}</p>
            <p class="text-gray-700 flex-grow mb-4 line-clamp-3">{{ job.description }}</p>
            <div class="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
              <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{{ job.jobType }}</span>
              <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full">{{ job.experienceLevel }}</span>
              <span class="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full">{{ job.salaryRange }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span [class]="job.status===0?'px-4 py-1 rounded-full bg-green-100 text-green-700':'bg-red-100 text-red-700' + ' px-3 py-1 rounded-full text-sm'">
                {{ job.status===0?'Active':'Inactive' }}
              </span>
              <div class="space-x-2">
                <button (click)="editJob(job)" class="px-4 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Edit</button>
                <button (click)="deleteJob(job.id)" class="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600">Delete</button>
              </div>
            </div>
          </article>
        </div>

        <!-- Applications Tab -->
        <div *ngIf="activeTab==='applications'" class="space-y-4">
          <h2 class="text-3xl font-semibold text-gray-900">Applications</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article *ngFor="let app of applications"
                     class="bg-white rounded-2xl shadow p-6 flex justify-between items-center hover:shadow-lg transition">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ app.jobTitle }}</h3>
                <p class="text-gray-500">{{ app.companyName }}</p>
                <p class="text-sm text-gray-600">Applicant: {{ app.userName }}</p>
                <p class="text-xs text-gray-400">
                  Applied {{ formatDate(app.submittedAt) }}
                  <span *ngIf="app.updatedAt"> · Updated {{ formatDate(app.updatedAt) }}</span>
                </p>
              </div>
              <select [value]="app.status"
                      (change)="updateApplicationStatus(app.id, +$any($event.target).value)"
                      class="form-input bg-gray-50 border-gray-300 rounded-lg p-2">
                <option [value]="0">Submitted</option>
                <option [value]="1">Interview</option>
                <option [value]="2">Rejected</option>
              </select>
            </article>
          </div>
        </div>

      </section>
    </main>
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

  constructor(private fb: FormBuilder, private jobService: JobService, private applicationService: ApplicationService) {
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
    this.jobService.getJobs().subscribe({ next: jobs => { this.jobs = jobs; this.loading = false; }, error: () => (this.loading = false) });
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAllApplications().subscribe({ next: apps => { this.applications = apps; this.loading = false; }, error: () => (this.loading = false) });
  }

  onSubmitJob(): void {
    if (this.jobForm.valid) {
      this.submittingJob = true;
      const data = this.jobForm.value as UpdateJobRequest;
      const req = this.editingJob ? this.jobService.updateJob(this.editingJob.id, data) : this.jobService.createJob(data);
      req.subscribe({ next: () => { this.submittingJob = false; this.cancelJobForm(); this.loadJobs(); }, error: () => (this.submittingJob = false) });
    }
  }

  editJob(job: JobPosting): void {
    this.editingJob = job;
    this.showCreateJobForm = true;
    this.jobForm.patchValue(job);
  }

  deleteJob(id: number): void {
    if (confirm('Delete this job?')) this.jobService.deleteJob(id).subscribe({ next: () => this.loadJobs() });
  }

  cancelJobForm(): void { this.showCreateJobForm = false; this.editingJob = null; this.jobForm.reset(); }

  updateApplicationStatus(id: number, status: ApplicationStatus): void { this.applicationService.updateApplicationStatus(id, { status }).subscribe({ next: () => this.loadApplications() }); }

  formatDate(d: string|Date): string { const dt = typeof d==='string'? new Date(d):d; return dt.toLocaleDateString(); }
}

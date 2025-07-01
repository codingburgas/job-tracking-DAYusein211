import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <main class="flex flex-col min-h-screen bg-gray-100">
      <!-- Hero + Search -->
      <section class=" text-white py-5">
        <div class="max-w-6xl text-left space-y-6 px-6"> 
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()"
                class="flex max-w-4xl  rounded-full bg-white overflow-hidden shadow-lg">
            <input formControlName="search"
                   type="text"
                   placeholder="Job title or keyword..."
                   class="flex-1 px-6 py-4 text-gray-800  border-none focus:outline-none" />
            <button type="submit"
                    class="bg-blue-600 hover:bg-blue-500 text-white px-12 font-semibold transition">
              search
            </button>
          </form>
        </div>
      </section>

      <!-- Main Content -->
      <div class="max-w-7xl  py-10">
        <div class="flex gap-8 px-6 ">
          <!-- Sidebar Filters -->
          <aside class="w-72 flex-shrink-0 bg-white rounded-2xl shadow p-6 sticky top-20 self-start">
            <h3 class="text-lg font-bold text-black mb-4">Filter</h3>
            <fieldset>
              <legend class="text-gray-900 font-semibold mb-2">Job Type</legend>
              <div class="flex flex-col space-y-3">
                <label *ngFor="let type of ['','Full-time','Part-time','Internship','Contract']"
                       class="flex items-center space-x-2 w-full cursor-pointer">
                  <input type="radio"
                         name="jobType"
                         [value]="type"
                         (change)="onJobTypeChange(type)"
                         [checked]="selectedJobType === type"
                         class="form-radio text-blue-600 peer" />
                  <span class="text-gray-700 font-medium text-opacity-70 peer-focus:text-blue-700">{{ type || 'All Types' }}</span>
                </label>
              </div>
            </fieldset>
          </aside>

          <!-- Job Listings -->
          <section class="flex-1">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold text-gray-900">
                Browse All <span class="text-blue-600">({{ jobs.length }})</span>
              </h2>
            </div>

            <!-- Job Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article *ngFor="let job of jobs"
                       class="bg-white rounded-2xl shadow p-6 flex flex-col hover:shadow-lg transition">
                <div class="flex items-center mb-4">
                  <div class="w-14 h-14 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {{ job.companyName.charAt(0) }}
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                    <p class="text-sm text-gray-500">{{ job.companyName }} • {{ job.location }}</p>
                  </div>
                  <span class="text-xs text-gray-400">{{ getTimeAgo(job.datePosted) }}</span>
                </div>

                <p class="text-gray-700 flex-grow mb-4 line-clamp-3">{{ job.description }}</p>

                <div class="flex flex-wrap gap-2 mb-6 text-sm">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{{ job.jobType }}</span>
                  <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full">{{ job.experienceLevel }}</span>
                  <span class="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full">{{ job.salaryRange }}</span>
                </div>

                <button *ngIf="!authService.isAdmin"
                        (click)="applyToJob(job.id)"
                        [disabled]="applyingToJob === job.id"
                        class="mt-auto bg-blue-600 hover:bg-blue-500 text-white rounded-full py-2 font-semibold transition">
                  {{ applyingToJob === job.id ? 'Applying…' : 'Apply' }}
                </button>
              </article>
            </div>

            <!-- Loading & Empty States -->
            <div *ngIf="loading" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
            </div>
            <div *ngIf="!loading && jobs.length === 0" class="text-center py-16 text-gray-500">
              No jobs found.
            </div>
          </section>
        </div>
      </div>
    </main>
  `
})
export class DashboardComponent implements OnInit {
  searchForm: FormGroup;
  jobs: JobPosting[] = [];
  loading = false;
  applyingToJob: number | null = null;
  selectedJobType = '';

  constructor(
      private fb: FormBuilder,
      private jobService: JobService,
      private applicationService: ApplicationService,
      public authService: AuthService
  ) {
    this.searchForm = this.fb.group({ search: [''] });
  }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.getJobs(this.searchForm.value.search, this.selectedJobType).subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  onSearch() {
    this.loadJobs();
  }

  onJobTypeChange(type: string) {
    this.selectedJobType = type;
    this.loadJobs();
  }

  applyToJob(id: number) {
    this.applyingToJob = id;
    this.applicationService.submitApplication(id).subscribe({ next: () => (this.applyingToJob = null), error: () => (this.applyingToJob = null) });
  }

  getTimeAgo(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    const w = Math.floor(d / 7);
    if (w < 4) return `${w}w ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <div class="hero-pattern">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center text-white">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              Where Talent Meets Opportunity
            </h1>
            <p class="text-xl mb-8 max-w-2xl mx-auto">
              Thousands of Jobs Await — Take Your Next Career Step Now!
            </p>

            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto">
              <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="flex rounded-full overflow-hidden shadow-lg">
                <input
                    formControlName="search"
                    type="text"
                    placeholder="Search here..."
                    class="flex-1 px-6 py-4 text-gray-800 focus:outline-none rounded-l-full"
                />
                <button
                    type="submit"
                    class="bg-gray-900 hover:bg-purple-900 text-white px-8 py-4 font-medium rounded-r-full transition-colors"
                >
                  Search Job
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-8">
          <!-- Sidebar -->
          <aside class="w-72 bg-white rounded-xl shadow-md p-6 sticky top-20 self-start">
            <!-- Filter Section -->
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Filter</h3>

            <!-- Job Type Filter -->
            <fieldset>
              <legend class="text-gray-700 font-medium mb-3">Job Type</legend>
              <div class="flex flex-col space-y-3">
                <label class="inline-flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="jobType" value="" (change)="onJobTypeChange('')" [checked]="selectedJobType === ''" />
                  <span>All Types</span>
                </label>
                <label class="inline-flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="jobType" value="Full-time" (change)="onJobTypeChange('Full-time')" [checked]="selectedJobType === 'Full-time'" />
                  <span>Full-time</span>
                </label>
                <label class="inline-flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="jobType" value="Part-time" (change)="onJobTypeChange('Part-time')" [checked]="selectedJobType === 'Part-time'" />
                  <span>Part-time</span>
                </label>
                <label class="inline-flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="jobType" value="Contract" (change)="onJobTypeChange('Contract')" [checked]="selectedJobType === 'Contract'" />
                  <span>Contract</span>
                </label>
                <label class="inline-flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="jobType" value="Internship" (change)="onJobTypeChange('Internship')" [checked]="selectedJobType === 'Internship'" />
                  <span>Internship</span>
                </label>
              </div>
            </fieldset>
          </aside>

          <!-- Job Listings -->
          <main class="flex-1">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold text-gray-900">
                Explore All Jobs <span class="text-purple-600">({{ jobs.length }})</span>
              </h2>
             
            </div>

            <!-- Job Cards -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article
                  *ngFor="let job of jobs"
                  class="card flex flex-col hover:shadow-lg transition-shadow cursor-pointer p-6"
              >
                <div class="flex items-center space-x-4 mb-4">
                  <div
                      class="w-14 h-14 rounded-lg flex items-center justify-center bg-purple-400 text-white font-bold text-xl"
                  >
                    {{ job.companyName.charAt(0) }}
                  </div>

                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                    <p class="text-sm text-gray-500">
                      {{ job.companyName }} • {{ job.location }}
                    </p>
                  </div>

                  <span class="text-xs text-gray-400">
                    {{ getTimeAgo(job.datePosted) }}
                  </span>
                </div>

                <p class="text-gray-700 flex-grow line-clamp-3 mb-4">
                  {{ job.description }}
                </p>

                <div class="flex flex-wrap gap-3 text-sm text-gray-700">
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">{{ job.jobType }}</span>
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">{{ job.experienceLevel }}</span>
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">{{ job.salaryRange }}</span>
                </div>

                <button
                    *ngIf="!authService.isAdmin"
                    (click)="applyToJob(job.id)"
                    [disabled]="applyingToJob === job.id"
                    class="mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full py-2 font-semibold transition"
                >
                  <span *ngIf="applyingToJob === job.id">Applying...</span>
                  <span *ngIf="applyingToJob !== job.id">Apply</span>
                </button>
              </article>
            </section>

            <!-- Loading State -->
            <div *ngIf="loading" class="flex justify-center py-10">
              <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600"></div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loading && jobs.length === 0" class="text-center py-16 text-gray-500">
              No jobs found.
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-pattern {
      background: linear-gradient(135deg, #7e5bef 0%, #ac42ff 100%);
    }
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 4px rgb(0 0 0 / 0.05);
    }
  `]
})
export class DashboardComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = false;
  applyingToJob: number | null = null;
  selectedJobType = '';
  searchForm: FormGroup;

  constructor(
      private jobService: JobService,
      private applicationService: ApplicationService,
      public authService: AuthService,
      private fb: FormBuilder
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
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadJobs();
  }

  onJobTypeChange(type: string) {
    this.selectedJobType = type;
    this.loadJobs();
  }

  applyToJob(jobId: number) {
    this.applyingToJob = jobId;
    this.applicationService.submitApplication(jobId).subscribe({
      next: () => {
        this.applyingToJob = null;
        alert('Application submitted successfully!');
      },
      error: () => {
        this.applyingToJob = null;
        alert('Failed to submit application.');
      }
    });
  }

  getTimeAgo(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
  }

}

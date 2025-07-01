import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="flex flex-col min-h-screen bg-gray-100">
      <!-- Header Section -->
      <section class="bg-[#0F172A] text-white py-16 px-6 text-center">
        <h1 class="text-5xl font-bold mb-2">My Applications</h1>
        
      </section>

      <!-- Content -->
      <section class="flex-1 w-full max-w-screen-xl mx-auto py-10 px-6">
        <ng-container *ngIf="loading; else loaded">
          <div class="flex justify-center items-center py-20 space-x-4">
            <div class="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <span class="text-blue-600 font-semibold text-xl">Loading applications...</span>
          </div>
        </ng-container>

        <ng-template #loaded>
          <ng-container *ngIf="applications.length > 0; else empty">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <article *ngFor="let app of applications"
                       class="bg-white rounded-2xl shadow p-6 flex flex-col hover:shadow-lg transition focus:outline-none focus:ring-4 focus:ring-orange-500"
                       tabindex="0"
                       [attr.aria-label]="'Job application for ' + app.jobTitle + ' at ' + app.companyName">
                <header class="flex items-center space-x-4 mb-6">
                  <div class="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                    {{ app.companyName.charAt(0) }}
                  </div>
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900">{{ app.jobTitle }}</h2>
                    <p class="text-gray-500 font-medium">{{ app.companyName }}</p>
                  </div>
                </header>

                <div class="mb-6 text-gray-700 space-y-2 text-sm">
                  <p><strong>Applied:</strong> <time [attr.datetime]="app.submittedAt">{{ formatDate(app.submittedAt) }}</time></p>
                  <p *ngIf="app.updatedAt"><strong>Updated:</strong> <time [attr.datetime]="app.updatedAt">{{ formatDate(app.updatedAt) }}</time></p>
                </div>

                <footer class="mt-auto">
                  <span [ngClass]="getBadgeClasses(app.status) + ' inline-flex items-center px-4 py-2 font-semibold rounded-full text-sm'">
                    <svg *ngIf="app.status === ApplicationStatus.Submitted" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                    <svg *ngIf="app.status === ApplicationStatus.SelectedForInterview" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.042 12.042 0 01.84 4.68c0 4.418-3.582 8-8 8a8.02 8.02 0 01-7.94-6.453L12 14z"/></svg>
                    <svg *ngIf="app.status === ApplicationStatus.Rejected" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    {{ getStatusText(app.status) }}
                  </span>
                </footer>
              </article>
            </div>
          </ng-container>

          <ng-template #empty>
            <div class="text-center py-20 text-gray-500 space-y-4">
              <svg class="mx-auto w-24 h-24 text-blue-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 class="text-2xl font-semibold">No applications found.</h3>
              <p class="text-lg max-w-md mx-auto text-gray-500">
                You haven't applied for any jobs yet.
              </p>
            </div>
          </ng-template>
        </ng-template>
      </section>
    </main>
  `,
  styles: [``]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  ApplicationStatus = ApplicationStatus;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (apps) => { this.applications = apps; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted: return 'Submitted';
      case ApplicationStatus.SelectedForInterview: return 'Interview';
      case ApplicationStatus.Rejected: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getBadgeClasses(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted: return 'bg-blue-100 text-blue-700';
      case ApplicationStatus.SelectedForInterview: return 'bg-green-100 text-green-700';
      case ApplicationStatus.Rejected: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

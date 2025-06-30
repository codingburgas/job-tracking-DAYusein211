import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto p-8">
      <header class="mb-10 text-center">
        <h1 class="text-5xl font-extrabold text-gradient bg-gradient-to-r from-purple-400 to-red-500 mb-2">
          My Applications
        </h1>
        <p class="text-gray-500 max-w-xl mx-auto text-lg">
          Keep track of your job applications and their current statuses.
        </p>
      </header>

      <ng-container *ngIf="loading; else loaded">
        <div class="flex justify-center items-center space-x-3 py-20">
          <svg
              class="animate-spin h-12 w-12 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span class="text-red-500 font-semibold text-xl">Loading applications...</span>
        </div>
      </ng-container>

      <ng-template #loaded>
        <ng-container *ngIf="applications.length > 0; else empty">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article
                *ngFor="let app of applications"
                class="border rounded-xl shadow-lg hover:shadow-2xl transition-shadow bg-white p-6 flex flex-col justify-between"
                tabindex="0"
                [attr.aria-label]="'Job application for ' + app.jobTitle + ' at ' + app.companyName"
            >
              <header class="flex items-center space-x-4 mb-5">
                <div
                    class="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-700 text-white font-extrabold text-2xl select-none"
                    aria-hidden="true"
                >
                  {{ app.companyName.charAt(0) }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 leading-tight">
                    {{ app.jobTitle }}
                  </h2>
                  <p class="text-gray-500 font-semibold tracking-wide">
                    {{ app.companyName }}
                  </p>
                </div>
              </header>

              <section class="mb-5 text-gray-600 space-y-1 text-sm">
                <p>
                  <strong>Applied:</strong>
                  <time [attr.datetime]="app.submittedAt">{{ formatDate(app.submittedAt) }}</time>
                </p>
                <p *ngIf="app.updatedAt">
                  <strong>Updated:</strong>
                  <time [attr.datetime]="app.updatedAt">{{ formatDate(app.updatedAt) }}</time>
                </p>
              </section>

              <footer class="mt-auto">
                <span
                    class="inline-flex items-center px-4 py-2 rounded-full font-semibold tracking-wide select-none"
                    [ngClass]="getBadgeClasses(app.status)"
                >
                  <svg
                      *ngIf="app.status === ApplicationStatus.Submitted"
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                  >
                    <path d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <svg
                      *ngIf="app.status === ApplicationStatus.SelectedForInterview"
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.042 12.042 0 01.84 4.68c0 4.418-3.582 8-8 8a8.02 8.02 0 01-7.94-6.453L12 14z" />
                  </svg>
                  <svg
                      *ngIf="app.status === ApplicationStatus.Rejected"
                      class="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  {{ getStatusText(app.status) }}
                </span>
              </footer>
            </article>
          </div>
        </ng-container>

        <ng-template #empty>
          <div class="text-center py-24 text-gray-400">
            <svg
                class="mx-auto mb-6 w-24 h-24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-2xl font-semibold mb-3">No applications found</h3>
            <p class="max-w-md mx-auto text-gray-500 text-lg">
              You haven't applied for any jobs yet. Start your search today!
            </p>
          </div>
        </ng-template>
      </ng-template>
    </section>
  `,
  styles: [`
    /* Text gradient for header */
    .text-gradient {
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    /* Badge colors with rounded-full */
    .badge-submitted {
      background-color: #fee2e2; /* red-100 */
      color: #b91c1c; /* red-700 */
      border-radius: 9999px;
    }
    .badge-interview {
      background-color: #d1fae5; /* green-100 */
      color: #065f46; /* green-800 */
      border-radius: 9999px;
    }
    .badge-rejected {
      background-color: #e0e7ff; /* indigo-100 */
      color: #4338ca; /* indigo-700 */
      border-radius: 9999px;
    }

    /* Badge base */
    span.inline-flex {
      user-select: none;
    }

    /* Focus outline on article cards */
    article:focus {
      outline: 3px solid #f97316; /* orange-500 */
      outline-offset: 3px;
      border-radius: 1rem; /* match rounded-xl */
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;

  ApplicationStatus = ApplicationStatus; // expose enum to template

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.loading = false;
      }
    });
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'Submitted';
      case ApplicationStatus.SelectedForInterview:
        return 'Interview';
      case ApplicationStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getBadgeClasses(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'badge-submitted';
      case ApplicationStatus.SelectedForInterview:
        return 'badge-interview';
      case ApplicationStatus.Rejected:
        return 'badge-rejected';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}

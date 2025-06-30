import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="flex items-center h-16 px-6 border-b border-gray-200">
          <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">L</span>
          </div>
          <span class="ml-3 text-xl font-semibold text-gray-900">Look</span>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a
              (click)="navigateToRoute('/')"
              class="block px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
              [class]="
              isActiveRoute('/') ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
            "
          >
            Browse Jobs
          </a>
          <a
              *ngIf="!authService.isAdmin"
              (click)="navigateToRoute('/applications')"
              class="block px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
              [class]="
              isActiveRoute('/applications') ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
            "
          >
            My Applications
          </a>
          <a
              *ngIf="authService.isAdmin"
              (click)="navigateToRoute('/admin')"
              class="block px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
              [class]="
              isActiveRoute('/admin') ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
            "
          >
            Owner
          </a>
        </nav>
      </aside>

      <!-- Main content area -->
      <div class="flex flex-col flex-1">
        <!-- Top bar -->
        <header class="flex items-center justify-end h-16 px-6 bg-white border-b border-gray-200">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{
                  (authService.currentUser$ | async)?.firstName?.charAt(0)
                }}
              </span>
            </div>
            <div class="hidden sm:flex flex-col text-right">
              <div class="text-sm font-medium text-gray-900">
                {{
                  (authService.currentUser$ | async)?.firstName
                }}
                {{
                  (authService.currentUser$ | async)?.lastName
                }}
              </div>
              <div class="text-xs text-gray-500">
                {{ (authService.currentUser$ | async)?.username }}
              </div>
            </div>
            <button
                (click)="logout()"
                class="btn btn-outline text-sm px-6 py-1 text-red-500 rounded-full border border-red-300 hover:border-red-600 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </header>

        <!-- Router content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(public authService: AuthService, private router: Router) {}

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

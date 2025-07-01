import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-100">
      <!-- Top Nav -->
      <header class="bg-[#0F172A] text-white py-4 px-6 flex items-center justify-between shadow-md">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">L</span>
          </div>
          <span class="text-2xl font-extrabold tracking-wider">LOOK</span>
        </div>
        <nav class="space-x-6 font-medium">
          <a routerLink="/" [class]="isActiveRoute('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'">
            Browse Jobs
          </a>
          <a
              *ngIf="!authService.isAdmin"
              routerLink="/applications"
              [class]="isActiveRoute('/applications') ? 'text-blue-400' : 'text-gray-300 hover:text-white'"
          >
            My Applications
          </a>
          <a
              *ngIf="authService.isAdmin"
              routerLink="/admin"
              [class]="isActiveRoute('/admin') ? 'text-blue-400' : 'text-gray-300 hover:text-white'"
          >
            Owner
          </a>
        </nav>
        <div class="flex items-center space-x-4">
         
          <div class="hidden sm:flex flex-col text-right">
            <div class="text-sm font-medium text-gray-200">
              {{ (authService.currentUser$ | async)?.firstName }}
              {{ (authService.currentUser$ | async)?.lastName }}
            </div>
           
          </div>
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-base">
              {{ (authService.currentUser$ | async)?.firstName?.charAt(0) }}
            </span>
          </div>
          <button
              (click)="logout()"
              class="px-6 py-1 text-sm rounded-full  bg-red-500 hover:bg-red-600 text-white transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <!-- Layout with Sidebar -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
       

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <main class="min-h-screen bg-gray-100 flex flex-col">
      <!-- Header -->
    
      <!-- Login Form Section -->
      <section class="flex-grow flex items-center justify-center px-4 py-16">
        <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">
              L
            </div>
            <h1 class="text-4xl font-bold text-gray-800">Welcome Back</h1>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="username" class="block mb-1 text-sm font-semibold text-gray-700">Username</label>
              <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Your username"
                  autocomplete="username"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                 class="text-sm text-red-500 mt-1">
                Username is required
              </p>
            </div>

            <div>
              <label for="password" class="block mb-1 text-sm font-semibold text-gray-700">Password</label>
              <input
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="Your password"
                  autocomplete="current-password"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                 class="text-sm text-red-500 mt-1">
                Password is required
              </p>
            </div>

            <p *ngIf="errorMessage" class="text-center text-red-500 font-medium">
              {{ errorMessage }}
            </p>

            <button
                type="submit"
                [disabled]="loginForm.invalid || loading"
                class="w-full bg-blue-600 hover:bg-blue-500 transition text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <footer class="mt-8 text-center text-sm text-gray-600">
            Don't have an account?
            <a routerLink="/register" class="text-blue-600 font-medium hover:underline">
              Sign up here
            </a>
          </footer>
        </div>
      </section>
    </main>
  `,
  styles: [`
    /* Hide number input spin buttons if you add any in the future */
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
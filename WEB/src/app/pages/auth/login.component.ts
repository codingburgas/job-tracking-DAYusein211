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
    <main class="min-h-screen flex flex-col justify-center bg-gradient-to-tr from-purple-900 to-purple-200 px-6 py-12">
      <section class="max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-10 text-purple-50">
        <header class="mb-8 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-purple-500 rounded-full mx-auto mb-4 font-extrabold text-2xl select-none">
            L
          </div>
          <h1 class="text-4xl font-extrabold tracking-wide mb-2">Welcome Back</h1>
          
        </header>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="username" class="block mb-1 font-semibold text-purple-200">Username</label>
            <input
                id="username"
                type="text"
                formControlName="username"
                placeholder="Your username"
                class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-200 placeholder-opacity-50 text-purple-50"
            />
            <p *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="mt-1 text-sm text-red-400">
              Username is required
            </p>
          </div>

          <div>
            <label for="password" class="block mb-1 font-semibold text-purple-200">Password</label>
            <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Your password"
                class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-100 placeholder-opacity-50 text-purple-50"
            />
            <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-sm text-red-400">
              Password is required
            </p>
          </div>

          <p *ngIf="errorMessage" class="text-center text-red-500 font-medium">{{ errorMessage }}</p>

          <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 transition rounded-md font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <footer class="mt-8 text-center text-sm text-purple-100">
          Don't have an account?
          <a routerLink="/register" class="font-semibold text-purple-400 hover:text-purple-200 underline cursor-pointer">
            Sign up here
          </a>
        </footer>

       
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
    if (!this.loginForm.valid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

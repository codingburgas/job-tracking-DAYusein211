import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <main class="min-h-screen flex flex-col justify-center bg-gradient-to-tr from-purple-900 to-purple-200 px-6 py-12">
      <section class="max-w-md mx-auto bg-gray-900 rounded-xl shadow-lg p-10 text-purple-50">
        <header class="mb-8 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-purple-500 rounded-full mx-auto mb-4 font-extrabold text-2xl select-none">
            L
          </div>
          <h2 class="text-3xl font-extrabold tracking-wide mb-2">Create your account</h2>
          
        </header>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block mb-1 font-semibold text-purple-200">First Name</label>
              <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  placeholder="First name"
                  class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-200 placeholder-opacity-50 text-purple-50"
              />
              <p *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="mt-1 text-sm text-red-400">
                First name is required
              </p>
            </div>

            <div>
              <label for="lastName" class="block mb-1 font-semibold text-purple-200">Last Name</label>
              <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  placeholder="Last name"
                  class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-200 placeholder-opacity-50 text-purple-50"
              />
              <p *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="mt-1 text-sm text-red-400">
                Last name is required
              </p>
            </div>
          </div>

          <div>
            <label for="middleName" class="block mb-1 font-semibold text-purple-200">Middle Name (Optional)</label>
            <input
                id="middleName"
                type="text"
                formControlName="middleName"
                placeholder="Middle name"
                class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-200 placeholder-opacity-50 text-purple-50"
            />
          </div>

          <div>
            <label for="username" class="block mb-1 font-semibold text-purple-200">Username</label>
            <input
                id="username"
                type="text"
                formControlName="username"
                placeholder="Choose a username"
                class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-200 placeholder-opacity-50 text-purple-50"
            />
            <p *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="mt-1 text-sm text-red-400">
              Username is required
            </p>
          </div>

          <div>
            <label for="password" class="block mb-1 font-semibold text-purple-200">Password</label>
            <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="Create a password"
                class="w-full rounded-md bg-gray-800 border border-purple-700 focus:border-purple-400 px-4 py-3 placeholder-purple-100 placeholder-opacity-50 text-purple-50"
            />
            <p *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="mt-1 text-sm text-red-400">
              Password must be at least 6 characters
            </p>
          </div>

          <p *ngIf="errorMessage" class="text-center text-red-500 font-medium">{{ errorMessage }}</p>

          <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="w-full py-3 mt-4 bg-purple-500 hover:bg-purple-400 transition rounded-md font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <footer class="mt-8 text-center text-sm text-purple-100">
          Already have an account?
          <a routerLink="/login" class="font-semibold text-purple-400 hover:text-purple-200 underline cursor-pointer">
            Sign in
          </a>
        </footer>
      </section>
    </main>
  `,
  styles: [`
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}

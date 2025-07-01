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
    <main class="min-h-screen bg-gray-100 flex flex-col">
      <!-- Header -->
      

      <!-- Register Form Section -->
      <section class="flex-grow flex items-center justify-center px-4 py-16">
        <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10">
          <div class="mb-8 text-center">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full mx-auto mb-4 text-2xl font-bold">L</div>
            <h2 class="text-3xl font-bold text-gray-800">Create your account</h2>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    formControlName="firstName"
                    placeholder="First name"
                    class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <p *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="text-sm text-red-500 mt-1">
                  First name is required
                </p>
              </div>

              <div>
                <label for="lastName" class="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    placeholder="Last name"
                    class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <p *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="text-sm text-red-500 mt-1">
                  Last name is required
                </p>
              </div>
            </div>

            <div>
              <label for="username" class="block mb-1 text-sm font-semibold text-gray-700">Username</label>
              <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Choose a username"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-sm text-red-500 mt-1">
                Username is required
              </p>
            </div>

            <div>
              <label for="password" class="block mb-1 text-sm font-semibold text-gray-700">Password</label>
              <input
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="Create a password"
                  class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-sm text-red-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            <p *ngIf="errorMessage" class="text-center text-red-500 font-medium">
              {{ errorMessage }}
            </p>

            <button
                type="submit"
                [disabled]="registerForm.invalid || loading"
                class="w-full bg-blue-600 hover:bg-blue-500 transition text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </form>

          <footer class="mt-8 text-center text-sm text-gray-600">
            Already have an account?
            <a routerLink="/login" class="text-blue-600 font-medium hover:underline">Sign in</a>
          </footer>
        </div>
      </section>
    </main>
  `,
  styles: [``]
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
      next: () => this.router.navigate(['/']),
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginForm } from '../../models/login-form.model';
import { AuthService } from '../../service/auth.service';
import { TokenStorageService } from '../../service/token-storage.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isSubmitting = signal<boolean>(false);

  private fb = inject(FormBuilder);

  loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) {
  }

  get email() {
    return this.loginForm.controls.email.value;
  }
  get password() {
    return this.loginForm.controls.password;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.tokenStorage.saveTokens(res.token);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
      }
    });
  }

}

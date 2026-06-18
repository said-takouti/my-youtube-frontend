import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/authService';


@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoginMode = signal(true);
  errorMessage = signal('');

  authForm = this.fb.group(
    {
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: [''],
      confirmPassword: [''],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  toggleMode() {
    this.isLoginMode.update((m) => !m);
    this.errorMessage.set('');
    if (this.isLoginMode()) {
      this.authForm.get('email')?.clearValidators();
      this.authForm.get('confirmPassword')?.clearValidators();
    } else {
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.authForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.authForm.get('email')?.updateValueAndValidity();
    this.authForm.get('confirmPassword')?.updateValueAndValidity();
    this.authForm.reset();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { username, password, email } = this.authForm.value;

    if (this.isLoginMode()) {
      if (this.auth.login(username!, password!)) {
        this.router.navigate(['/search']);
      } else {
        this.errorMessage.set("Nom d'utilisateur ou mot de passe incorrect");
      }
    } else {
      const user = { username: username!, email: email!, password: password! };
      if (this.auth.register(user)) {
        this.router.navigate(['/search']);
      } else {
        this.errorMessage.set('Utilisateur ou email déjà existant');
      }
    }
  }
}

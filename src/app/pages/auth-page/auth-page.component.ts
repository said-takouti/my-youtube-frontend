import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoginMode = signal(true);
  errorMessage = signal('');

  authForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    email: [''],
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const mode = params.get('mode');
      this.isLoginMode.set(mode !== 'signup');
      this.toggleMode();
    });
  }

  toggleMode() {
    this.errorMessage.set('');

    if (this.isLoginMode()) {
      this.authForm.get('email')?.clearValidators();
    } else {
      this.authForm.get('email')?.setValidators([Validators.required, Validators.email]);
    }

    this.authForm.get('email')?.updateValueAndValidity();
    this.authForm.reset();
  }

  goToRegister() {
    this.router.navigate(['/auth/signup']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
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

      const newUser = { username: username!, email: email!, password: password! };

      if (this.auth.register(newUser)) {
        this.router.navigate(['/search']);

      } else {
        this.errorMessage.set('Cet utilisateur existe déjà');
      }
    }
  }
}

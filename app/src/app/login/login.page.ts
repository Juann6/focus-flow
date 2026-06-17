import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonIcon,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  isLoginMode = true;
  showPassword = false;

  // Form Fields
  name = '';
  email = '';
  password = '';

  // Password Recovery Fields & States
  isRecoveryMode = false;
  recoveryStep: 'email' | 'reset' = 'email';
  recoveryEmail = '';
  generatedCode = '';
  enteredCode = '';
  newPassword = '';
  confirmPassword = '';

  // Feedback Messages
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {
    // Register IonIcons for standalone usage
    addIcons({ mailOutline, lockClosedOutline, personOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    // If user is already logged in, redirect to home
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/home']);
    }

    // Initialize mock database if empty
    const users = localStorage.getItem('users');
    if (!users) {
      const defaultUsers = [
        {
          name: 'Juan David Naranjo',
          email: 'juan@email.com',
          password: 'password123'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.isRecoveryMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.name = '';
    this.email = '';
    this.password = '';
  }

  toggleRecoveryMode(enable: boolean) {
    this.isRecoveryMode = enable;
    this.recoveryStep = 'email';
    this.errorMessage = '';
    this.successMessage = '';
    this.recoveryEmail = '';
    this.enteredCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.generatedCode = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  sendRecoveryCode() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.recoveryEmail) {
      this.errorMessage = 'Por favor, ingresa tu correo electrónico.';
      return;
    }

    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    const userExists = users.some((u: any) => u.email.toLowerCase() === this.recoveryEmail.toLowerCase());

    if (!userExists) {
      this.errorMessage = 'El correo electrónico no está registrado.';
      return;
    }

    // Generate a 4-digit verification code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.generatedCode = code;

    // Simulate sending verification code via alert
    this.successMessage = `¡Código de verificación enviado! Simulación: Usa el código ${code}`;

    setTimeout(() => {
      this.recoveryStep = 'reset';
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.enteredCode || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    if (this.enteredCode !== this.generatedCode) {
      this.errorMessage = 'El código de verificación es incorrecto.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === this.recoveryEmail.toLowerCase());

    if (userIndex === -1) {
      this.errorMessage = 'Error al actualizar la contraseña. Usuario no encontrado.';
      return;
    }

    users[userIndex].password = this.newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    this.successMessage = '¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...';

    setTimeout(() => {
      this.toggleRecoveryMode(false);
    }, 2000);
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);

    const user = users.find((u: any) => u.email.toLowerCase() === this.email.toLowerCase());

    if (!user) {
      this.errorMessage = 'El correo electrónico no está registrado.';
      return;
    }

    if (user.password !== this.password) {
      this.errorMessage = 'Contraseña incorrecta.';
      return;
    }

    // Set current user session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1200);
  }

  private handleRegister() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);

    const emailExists = users.some((u: any) => u.email.toLowerCase() === this.email.toLowerCase());

    if (emailExists) {
      this.errorMessage = 'El correo electrónico ya está registrado.';
      return;
    }

    // Save new user
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in automatically
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    this.successMessage = '¡Cuenta creada con éxito! Redirigiendo...';
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1200);
  }

  loginWithGoogle() {
    this.errorMessage = '';
    this.successMessage = '¡Inicio de sesión con Google exitoso! Redirigiendo...';

    const googleUser = {
      name: 'Usuario Google',
      email: 'google@email.com',
      password: ''
    };

    localStorage.setItem('currentUser', JSON.stringify(googleUser));

    // Save to users database if not exists
    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    const exists = users.some((u: any) => u.email === googleUser.email);
    if (!exists) {
      users.push(googleUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1200);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner, CommonModule, FormsModule]
})
export class LoginPage {
  // Modo de formulario: 'signin' (Iniciar Sesión), 'signup' (Crear Cuenta), 'forgot' (Recuperar Contraseña)
  mode: 'signin' | 'signup' | 'forgot' = 'signin';

  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  toggleMode(newMode: 'signin' | 'signup' | 'forgot') {
    this.mode = newMode;
    this.clearForm();
  }

  clearForm() {
    this.password = '';
    this.confirmPassword = '';
    this.name = '';
  }

  async onSubmit() {
    if (!this.email) {
      this.showToast('Por favor, ingresa tu correo electrónico', 'warning');
      return;
    }

    if (this.mode !== 'forgot' && !this.password) {
      this.showToast('Por favor, ingresa tu contraseña', 'warning');
      return;
    }

    this.loading = true;

    try {
      if (this.mode === 'signin') {
        // Iniciar Sesión
        await this.authService.login(this.email, this.password);
        this.showToast('¡Inicio de sesión exitoso!', 'success');
        this.router.navigateByUrl('/home');
      } else if (this.mode === 'signup') {
        // Registrar usuario
        if (!this.name) {
          this.showToast('Por favor, ingresa tu nombre', 'warning');
          this.loading = false;
          return;
        }
        if (this.password !== this.confirmPassword) {
          this.showToast('Las contraseñas no coinciden', 'danger');
          this.loading = false;
          return;
        }
        await this.authService.register(this.email, this.password, this.name);
        this.showToast('¡Cuenta creada con éxito!', 'success');
        this.router.navigateByUrl('/home');
      } else if (this.mode === 'forgot') {
        // Recuperar Contraseña
        await this.authService.resetPassword(this.email);
        this.showToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.', 'success');
        this.mode = 'signin';
      }
    } catch (error: any) {
      console.error(error);
      this.handleFirebaseError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Maneja y traduce los códigos de error más comunes de Firebase Auth
   */
  private handleFirebaseError(error: any) {
    let message = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    const code = error?.code || '';

    switch (code) {
      case 'auth/invalid-email':
        message = 'El correo electrónico no es válido.';
        break;
      case 'auth/user-disabled':
        message = 'Esta cuenta ha sido deshabilitada.';
        break;
      case 'auth/user-not-found':
        message = 'No existe ningún usuario registrado con este correo.';
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        break;
      case 'auth/email-already-in-use':
        message = 'Este correo electrónico ya está registrado por otro usuario.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos fallidos. Por seguridad, inténtalo más tarde.';
        break;
    }

    this.showToast(message, 'danger');
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}

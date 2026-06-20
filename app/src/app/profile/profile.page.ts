import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';
import { ToastController } from '@ionic/angular';
import { IonToggle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomNavigationComponent, IonToggle, IonSelect, IonSelectOption]
})
export class ProfilePage implements OnInit {

  editando: boolean = false;

  perfil = {
    email: '',
    nombre: '',
    fechaNacimiento: '',
    edad: 0,
    ciclo: 28,
    foto: 'assets/images/profile.jpg'
  };

  notificaciones: boolean = true;
  tema: string = 'Claro';


  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    // Sincronizar datos del usuario actual de Firebase
    const user = this.authService.currentUser();
    if (user) {
      this.perfil.email = user.email || '';
      this.perfil.nombre = user.displayName || 'Usuario';
      this.perfil.foto = user.photoURL || localStorage.getItem('perfil_foto') || 'assets/images/profile.jpg';
    }

    const data = localStorage.getItem('perfil');
    if (data) {
      const parsedData = JSON.parse(data);
      this.perfil.fechaNacimiento = parsedData.fechaNacimiento || '';
      this.perfil.edad = parsedData.edad || 0;
      this.perfil.ciclo = parsedData.ciclo || 28;
      // Si Firebase no tiene nombre cargado, conservar el local
      if (!this.perfil.nombre && parsedData.nombre) {
        this.perfil.nombre = parsedData.nombre;
      }
    }

    // Inicializar el tema actual desde el servicio de temas
    this.tema = this.themeService.activeTheme();

    const prefs = localStorage.getItem('preferencias');
    if (prefs) {
      const { notificaciones } = JSON.parse(prefs);
      this.notificaciones = notificaciones;
    }
  }

  onTemaChange() {
    this.themeService.setTheme(this.tema as 'Claro' | 'Oscuro');
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño de la imagen (máximo 1.5 MB para no saturar base64 en storage)
      if (file.size > 1.5 * 1024 * 1024) {
        const toast = await this.toastController.create({
          message: 'La imagen debe ser menor a 1.5MB',
          duration: 3000,
          position: 'bottom',
          color: 'warning'
        });
        await toast.present();
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        this.perfil.foto = base64;
        localStorage.setItem('perfil_foto', base64);

        try {
          await this.authService.updateProfilePhoto(base64);
          const toast = await this.toastController.create({
            message: 'Foto de perfil actualizada con éxito',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          await toast.present();
        } catch (e) {
          console.error(e);
          const toast = await this.toastController.create({
            message: 'Foto actualizada localmente (Error al guardar en la nube)',
            duration: 3000,
            position: 'bottom',
            color: 'warning'
          });
          await toast.present();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  calcularEdad() {
    if (!this.perfil.fechaNacimiento) return;

    const hoy = new Date();
    const nacimiento = new Date(this.perfil.fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    this.perfil.edad = edad;
  }

  async guardarPerfil() {
    this.calcularEdad();
    localStorage.setItem('perfil', JSON.stringify(this.perfil));
    
    // Actualizar nombre en Firebase
    try {
      await this.authService.updateProfileName(this.perfil.nombre);
    } catch (e) {
      console.error('Error al actualizar nombre en Firebase', e);
    }

    this.editando = false;

    const toast = await this.toastController.create({
      message: 'Perfil actualizado con éxito',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async guardarPreferencias() {
    localStorage.setItem('preferencias', JSON.stringify({
      notificaciones: this.notificaciones,
      tema: this.tema
    }));
    const toast = await this.toastController.create({
      message: 'Preferencias guardadas',
      duration: 2000,
      position:'bottom',
      color: 'success'
    });
    await toast.present();
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await this.authService.logout();
      const toast = await this.toastController.create({
        message: 'Sesión cerrada con éxito',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: 'Error al cerrar sesión',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  /**
   * Cambiar contraseña enviando correo de recuperación
   */
  async cambiarContrasena() {
    try {
      if (this.perfil.email) {
        await this.authService.resetPassword(this.perfil.email);
        const toast = await this.toastController.create({
          message: 'Se ha enviado un correo para restablecer tu contraseña.',
          duration: 3000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      } else {
        throw new Error('El correo del perfil está vacío.');
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: 'Error al enviar el correo de recuperación.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';
import { ToastController } from '@ionic/angular';
import { IonToggle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

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
    email: 'juan@email.com',
    nombre: 'Juan',
    fechaNacimiento: '',
    edad: 0,
    ciclo: 28
  };

  notificaciones: boolean = true;
  tema: string = 'Claro';


  constructor(private toastController: ToastController) { }

  ngOnInit() {

    const data = localStorage.getItem('perfil');
    if (data) {
      this.perfil = JSON.parse(data);
    }

    const prefs = localStorage.getItem('preferencias');
    if (prefs) {
      const { notificaciones, tema } = JSON.parse(prefs);
      this.notificaciones = notificaciones;
      this.tema = tema;
    }
  }

  calcularEdad() {
    if (this.perfil.fechaNacimiento) return;

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
}
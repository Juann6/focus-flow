import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomNavigationComponent]
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
 cambiarContrasena() {
    alert('Se ha enviado un enlace de recuperación de contraseña al correo registrado.');
  }

  cerrarSesion() {
    const confirmar = confirm('¿Desea cerrar sesión?');

    if (confirmar) {
      alert('Sesión cerrada correctamente');
    }
  }
  
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomNavigationComponent]
})
export class StatisticsPage implements OnInit {

historial = [
    {
      actividad: 'Leer 30 minutos',
      fecha: 'Hoy',
      icono: '✅'
    },
    {
      actividad: 'Completar informe',
      fecha: 'Ayer',
      icono: '📋'
    },
    {
      actividad: 'Hacer ejercicio',
      fecha: 'Hace 2 días',
      icono: '🏃'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}

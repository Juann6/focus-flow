import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';

import {
  LocalNotifications
} from '@capacitor/local-notifications';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BottomNavigationComponent
  ]
})
export class StatisticsPage implements OnInit {

  habits: any[] = [];
  tasks: any[] = [];

  habitosCompletados = 0;
  tareasCompletadas = 0;

  progresoHabitos = 0;
  progresoTareas = 0;

  productividad = 0;
  rachaTotal = 0;

  actividadSemanal = [
    { dia: 'Lun', cantidad: 0 },
    { dia: 'Mar', cantidad: 0 },
    { dia: 'Mié', cantidad: 0 },
    { dia: 'Jue', cantidad: 0 },
    { dia: 'Vie', cantidad: 0 },
    { dia: 'Sáb', cantidad: 0 },
    { dia: 'Dom', cantidad: 0 }
  ];

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {

    this.habits =
      JSON.parse(localStorage.getItem('habits') || '[]');

    this.tasks =
      JSON.parse(localStorage.getItem('tasks') || '[]');

    this.calcularEstadisticas();
  }

  calcularEstadisticas() {

    this.habitosCompletados =
      this.habits.filter(
        habit => habit.completado
      ).length;

    this.tareasCompletadas =
      this.tasks.filter(
        task => task.completada
      ).length;

    this.progresoHabitos =
      this.habits.length > 0
        ? Math.round(
            (this.habitosCompletados /
              this.habits.length) * 100
          )
        : 0;

    this.progresoTareas =
      this.tasks.length > 0
        ? Math.round(
            (this.tareasCompletadas /
              this.tasks.length) * 100
          )
        : 0;

    this.rachaTotal =
      this.habits.reduce(
        (total, habit) =>
          total + (habit.racha || 0),
        0
      );

    this.productividad =
      Math.round(
        (
          this.progresoHabitos +
          this.progresoTareas
        ) / 2
      );

    this.calcularActividadSemanal();
  }

  calcularActividadSemanal() {

    const diasSemana = [0, 0, 0, 0, 0, 0, 0];

    this.tasks.forEach(task => {

      if (task.completada && task.date) {

        const fecha = new Date(task.date);

        let dia = fecha.getDay();

        dia = dia === 0 ? 6 : dia - 1;

        diasSemana[dia]++;
      }
    });

    this.actividadSemanal = [
      { dia: 'Lun', cantidad: diasSemana[0] },
      { dia: 'Mar', cantidad: diasSemana[1] },
      { dia: 'Mié', cantidad: diasSemana[2] },
      { dia: 'Jue', cantidad: diasSemana[3] },
      { dia: 'Vie', cantidad: diasSemana[4] },
      { dia: 'Sáb', cantidad: diasSemana[5] },
      { dia: 'Dom', cantidad: diasSemana[6] }
    ];
  }

  async programarRecordatorio() {

    await LocalNotifications.requestPermissions();

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Focus Flow',
          body: 'Recuerda completar tus hábitos y tareas.',
          schedule: {
            at: new Date(
              Date.now() + 60000
            )
          }
        }
      ]
    });
  }
}

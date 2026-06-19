import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter } from '@ionic/angular/standalone';
import { RouterLink   } from '@angular/router';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';
import { OnInit } from '@angular/core';
import { Habit } from '../models/habit.model';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, RouterLink, BottomNavigationComponent, CommonModule],
})
export class HomePage implements OnInit {

  habits: Habit[] = [];
  tasks: Task[] = [];

  ngOnInit() {
    this.cargarHabitos();
    this.cargarTasks();
  }

  cargarHabitos() {
    const datos = localStorage.getItem('habits');
    if (datos) {
      this.habits = JSON.parse(datos);
    }
  }

  cargarTasks() {
    const datos= localStorage.getItem('tasks');

    if (datos) {
      this.tasks = JSON.parse(datos);
    }
  }

  get totalHabits(): number {
    return this.habits.length;
  }

  get habitsCompletados(): number {
    return this.habits.filter(
      habit => habit.completado
    ).length;
  }

  get totalTareas(): number {
    return this.tasks.length;
  }

  get tareasPendientes(): number {
    return this.tasks.filter(
      task => !task.completada
    ).length;
  }

  get tareasPendientesLista(): Task[] {
    return this.tasks.filter(
      task => !task.completada
    );
  }

  get habitsPendientes() {
    return this.habits.filter(
      habit => !habit.completado
    );  
  }


  constructor() {}
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';
import { Habit } from '../models/habit.model';
import { addIcons } from 'ionicons';

import {
  checkmarkCircleOutline,
  listOutline,
  clipboardOutline,
  trendingUpOutline,
  checkmarkDoneOutline,
  flameOutline,
  statsChartOutline,
  fitnessOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomNavigationComponent]
})
export class HabitsPage implements OnInit {
  
  @ViewChild('formulario')
  formulario!: ElementRef;

  habits: Habit[] = []

  constructor() {

  addIcons({
    checkmarkCircleOutline,
    listOutline,
    clipboardOutline,
    trendingUpOutline,
    checkmarkDoneOutline,
    flameOutline,
    statsChartOutline,
    fitnessOutline
  });

}

  ngOnInit() {
    this.cargarHabitos();
  }
  cambiarEstado(habit: Habit) {
    this.guardarHabitos();
  }

  agregarHabit() {
    if (!this.nuevoHabit.trim()) {
      return;
    }

    const nuevoHabit: Habit = {
      id: Date.now(),
      name: this.nuevoHabit,
      completado: false,
      fechaCreacion: new Date(),
      racha: 0
    };
    this.habits.push(nuevoHabit)
    this.guardarHabitos();
    this.nuevoHabit = '';
    this.mostrarFormulario = false;
  }

  eliminarHabit(id: number) {
    this.habits = this.habits.filter(
      habit => habit.id !== id
    );
    this.guardarHabitos();
  }

  editarHabit(habit: Habit) {
    this.habitEditando = habit;
    this.editando = true;
  }

  guardarEdicion() {
    this.guardarHabitos();
    this.habitEditando = null;
    this.editando = false;
  }

  cancelarEdicion() {
    this.habitEditando = null;
    this.editando = false;
  }

  guardarHabitos() {
    localStorage.setItem('habits', JSON.stringify(this.habits));
  }

  cargarHabitos() {
    const datos = localStorage.getItem('habits');
    if (datos) {
      this.habits = JSON.parse(datos);
    }
  }

  cambiarFiltro(filtro: string) {
    this.filtroActual = filtro;
  }

  mostrarFormularioHabit() {

    this.mostrarFormulario = true;

    setTimeout(() => {

      this.formulario.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

  }, 100);

}

  get habitsFiltrados() {
    if (this.filtroActual === 'activos') {
      return this.habits.filter(habit => habit.completado === false);
    } else if (this.filtroActual === 'completados') {
      return this.habits.filter(habit => habit.completado === true);
    } else {
      return this.habits;
    }

  }

  obtenerHabitosCompletados(): number {
    return this.habits.filter(
      habit => habit.completado
    ).length;
  }

  obtenerRachaTotal(): number {
    return this.habits.reduce(
      (total, habit) => total + habit.racha,
      0
    );
  }

  obtenerProgreso(): number {
    if (this.habits.length === 0) {
      return 0;
    }
    return Math.round(
      (this.obtenerHabitosCompletados() / this.habits.length) * 100
    );
  }

  nuevoHabit = '';
  mostrarFormulario = false;
  habitEditando: Habit | null = null;
  editando = false;
  filtroActual = 'todos';

}

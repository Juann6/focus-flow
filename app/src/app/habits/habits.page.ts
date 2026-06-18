import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomNavigationComponent } from '../shared/bottom-navigation/bottom-navigation';
import { Habit } from '../models/habit.model';

@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomNavigationComponent]
})
export class HabitsPage implements OnInit {

  habits: Habit[] = []

  constructor() { }

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

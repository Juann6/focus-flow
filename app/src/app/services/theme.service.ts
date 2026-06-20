import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Guardamos el tema activo usando un Signal
  public activeTheme = signal<'Claro' | 'Oscuro'>('Claro');

  constructor() {
    this.loadTheme();
  }

  /**
   * Carga el tema inicial desde localStorage o desde el sistema operativo
   */
  loadTheme() {
    const prefsStr = localStorage.getItem('preferencias');
    let theme: 'Claro' | 'Oscuro' = 'Claro';

    if (prefsStr) {
      try {
        const prefs = JSON.parse(prefsStr);
        if (prefs.tema === 'Oscuro' || prefs.tema === 'Claro') {
          theme = prefs.tema;
        }
      } catch (e) {
        console.error('Error al parsear preferencias', e);
      }
    } else {
      // Si no hay preferencia guardada, verificar el esquema del sistema operativo
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'Oscuro' : 'Claro';
    }

    this.setTheme(theme);
  }

  /**
   * Cambia el tema de la aplicación y lo guarda
   */
  setTheme(theme: 'Claro' | 'Oscuro') {
    this.activeTheme.set(theme);

    const root = document.documentElement;
    if (theme === 'Oscuro') {
      root.classList.add('ion-palette-dark');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('ion-palette-dark');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Actualizar en localStorage respetando las preferencias anteriores
    const prefsStr = localStorage.getItem('preferencias');
    let prefs = { notificaciones: true, tema: theme };
    if (prefsStr) {
      try {
        prefs = JSON.parse(prefsStr);
        prefs.tema = theme;
      } catch (e) {
        // Ignorar
      }
    }
    localStorage.setItem('preferencias', JSON.stringify(prefs));
  }
}

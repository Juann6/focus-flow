import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    canActivate: [publicGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'task',
    loadComponent: () => import('./tasks/task.page').then( m => m.TaskPage),
    canActivate: [authGuard]
  },
  {
    path: 'habits',
    loadComponent: () => import('./habits/habits.page').then( m => m.HabitsPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.page').then( m => m.StatisticsPage),
    canActivate: [authGuard]
  },
 ];

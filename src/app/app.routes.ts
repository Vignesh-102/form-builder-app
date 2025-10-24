import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthPage } from './auth/components/auth-page/auth-page';
import { DynamicForm } from './features/forms/components/dynamic-form/dynamic-form';
import { DashboardComponent } from './features/forms/components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'formBuilder',
    component: DynamicForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: AuthPage
  },
  {
    path: 'register',
    component: AuthPage
  }
];

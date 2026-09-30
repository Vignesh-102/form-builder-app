import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../login/login';
import { Register } from '../register/register';


@Component({
  selector: 'app-auth-page',
  imports: [Login, Register],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss'
})
export class AuthPage {
  isLogin: boolean = true;

  constructor(private router: Router) {
    this.isLogin = this.router.url === '/login';
  }

}

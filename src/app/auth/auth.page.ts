import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  email: string = null;
  password:string = null;


  constructor(private userService: UserService) { }
  login() {
    this.userService.login(this.email,this.password);
  }
  logout() {
    this.userService.logout();
  }

}

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  email: string = null;
  password:string = null;


  constructor(private userService: UserService,private router:Router,) { }
  login() {
    this.userService.login(this.email,this.password).then(() => {
        // redirect if success
        this.router.navigate(['']);
    }).catch(err => {
      // TODO handle error (display error message)
      console.log ("err: ", JSON.stringify(err));
    });
  }
  logout() {
    this.userService.logout();
  }

}

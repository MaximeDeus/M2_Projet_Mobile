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
  error:Error = null;


  constructor(private userService: UserService,private router:Router,) { }
  login() {
    this.userService.login(this.email,this.password).then(() => {
        // redirect if success
        this.error = null;
        this.router.navigate(['']);
    }).catch(err => { // Display message if any issue during authentication
      this.error = err;
      if (this.error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
        this.error.message = 'Invalid credentials. Please try again.'
      }
      console.log ("err: ", JSON.stringify(err));
    });
  }
  logout() {
    this.userService.logout();
  }

}

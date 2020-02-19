import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  email: string = null;
  password:string = null;


  constructor(public afAuth: AngularFireAuth) { }
  login() {
    console.log(`email : ${this.email} \n password : ${this.password} `);
    this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then((res)=> console.log(res));
    // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  // TODO move this method
  logout() {
    this.afAuth.auth.signOut();
  }

}

import { Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email: string = null;
  password: string = null;

  constructor(public afAuth: AngularFireAuth) { }
  signup() {
    console.log(`email : ${this.email} \n password : ${this.password} `);
    this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.password).then((res)=> console.log(res));
    // TODO redirect to /home with message Hello {userName}
    // TODO (add button 'My todolists' who redirect to right todolists)
    // TODO implements guards
    // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }s

}

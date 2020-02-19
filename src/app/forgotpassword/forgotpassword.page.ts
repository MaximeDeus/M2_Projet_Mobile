import { Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage{
  email: string = null;
  constructor(public afAuth: AngularFireAuth) { }

  sendPasswordByEmail(){
    console.log(`email : ${this.email}`);
    this.afAuth.auth.sendPasswordResetEmail(this.email).then((res)=> console.log(res)).catch(err => console.log( err.message));;
    // TODO if success, update view with green message ('a link for resetting password had been successfully sent to your email address')
    // TODO otherwise, update view with red message ('no used are registered using this email address. Please try again')
  }f

}

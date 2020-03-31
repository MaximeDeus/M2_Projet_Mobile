import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
    displayName: string = null;
    email: string = null;
    password: string = null;
    error: Error = null;

    constructor(public afAuth: AngularFireAuth, public userService: UserService, private router: Router) {
    }

    signUp() {
        console.log(`displayName : ${this.displayName} \n email : ${this.email} \n password : ${this.password} `);
        /**Promise.all([
         this.userService.signUp(this.email, this.password),
         this.userService.login(this.email, this.password),
         this.userService.editUserName(this.displayName)])

         */
        this.userService.signUp(this.email, this.password).then(() => {
            this.userService.login(this.email, this.password).then(() => {
                this.userService.editUserName(this.displayName).then(() => {
                    this.error = null
                    this.router.navigate(['']);
                }).catch(err => {
                    this.error = err;
                })
            }).catch(err => {
                this.error = err;
            })
        }).catch(err => {
            this.error = err;
        })
    }
}

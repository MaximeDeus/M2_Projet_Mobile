import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";

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

    constructor(
        public afAuth: AngularFireAuth,
        public userService: UserService,
        private router: Router,
        private listService: TodoslistService) {
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
                const uid = this.userService.get().uid;
                // Bad fix, combineLatest Observable is triggered iff all observables are triggered
                // So we must add ghost data for triggering observable before add true datas
                this.listService.init();
                this.listService.addTodolist({name: "", todos: [], allowRead: [uid], allowWrite: [uid], owner: uid}).then(() => {
                this.userService.init();
                this.userService.editUserName(this.displayName).then(() => {
                    this.userService.addUser({name: this.displayName, uid});
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
        }).catch(err => {
            this.error = err;
        })
    }
}

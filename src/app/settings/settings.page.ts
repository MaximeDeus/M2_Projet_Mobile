import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "firebase";
import {AlertController, ToastController} from "@ionic/angular";
import {UserDB} from "../model/userDB";
import {Observable} from "rxjs";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit{

    user: User;
    userDB:UserDB;
    displayName: string | null;
    email: string | null;
    newPassword: string | null;
    confirmNewPassword: string | null;
    error: Error = null;
    private usersObservable: Observable<Array<UserDB>>;
    constructor(
        private userService: UserService,
        public alertCtrl: AlertController,
        public toastController: ToastController)
    {}
    ngOnInit(): void
    {
        this.userService.init();
        this.user = this.userService.get();
        this.displayName = this.user.displayName;
        this.email = this.user.email;
        this.newPassword = '';
        this.confirmNewPassword = '';

        // Used for updating users collection when changing displayName
        this.usersObservable = this.userService.getUsers();
        this.usersObservable.subscribe(users => {
            this.userDB = users.filter(user => user.uid === this.user.uid)[0];
        })
    }

    checkUserInput() {
        console.log('before edit : ', JSON.stringify(this.user));
        if (this.newPassword !== this.confirmNewPassword) {
            this.error = {
                name: "PASSWORD_NOT_IDENTICAL",
                message: "Confirmed password does not match with new password "
            }
        }
        // If there is any change, we need to re-auth user
        else if (this.email !== this.user.email || this.displayName !== this.user.displayName || this.newPassword) {
            this.displayPromptConfirmPassword();
        }
    }


    editUser(password){
            this.userService.login(this.user.email,password).then((userCredential) => {
                this.userService.editUser(
                    userCredential,
                    this.displayName,
                    this.email,
                    password
                ).then(() => {
                    this.userService.editUserDB({
                        id: this.userDB.id,
                        name: this.displayName, // Update displayName
                        uid: this.userDB.uid
                        }
                    ).then(() => {
                    console.log('after success edit : ', JSON.stringify(this.user));
                    // redirect if success
                    this.error = null;
                    // TODO display green popup success message (Your account were successfully updated :) )
                    this.displayToastSuccess();
                })}).catch(err => { // Display message if any issue during authentication
                    console.log('after error edit : ', JSON.stringify(this.user));
                    this.error = err;
                    // TODO display green popup success message (Oups, something went wrong, please check your entries)
                    console.log("err: ", JSON.stringify(err));
                    this.displayToastFailure();
                });
            })
        }

    async displayPromptConfirmPassword() {
        let alert = await this.alertCtrl.create({
            header: 'Please enter your password',

            inputs: [
                {
                    name: 'password',
                    type:'password',
                    placeholder: '********',
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        if (data.password) {
                            this.editUser(data.password);
                        } else {
                            return false;
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    async displayToastSuccess() {
        const toast = await this.toastController.create({
            message: 'Your account were successfully updated :)',
            duration: 4000,
            color:"success"
        });
        await toast.present();
    }

    async displayToastFailure() {
        const toast = await this.toastController.create({
            message: 'Oups, something went wrong :(',
            duration: 4000,
            color:"danger"
        });
        await toast.present();
    }
}

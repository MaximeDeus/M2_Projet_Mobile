import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "firebase";
import {Observable} from "rxjs";
import {Todolist} from "../model/todolist";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(public afAuth: AngularFireAuth) {
    }

    get(): User {
        return this.afAuth.auth.currentUser;
    }

    login(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.afAuth.auth.signOut();
    }

    signUp(email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    editUserName(displayName) {
        console.log('displayName : ', displayName);
        return this.afAuth.auth.currentUser.updateProfile({displayName: displayName});
    }

    editUser(userCredential, displayName, email, photoURL, password) {
        // return userCredential.user.updateEmail('newyou@domain.com');
        // this.afAuth.auth.currentUser.updateProfile({displayName:displayName});
        return Promise.all([
            this.afAuth.auth.currentUser.updateProfile({displayName: displayName}),
            this.afAuth.auth.currentUser.updateEmail(email),
            this.afAuth.auth.currentUser.updatePassword(password)
        ]);
    }
}

/**
 let updateOperations : Array<Promise<void>> = [];
 updateOperations.push(this.afAuth.auth.currentUser.updateProfile({displayName:displayName}));
 updateOperations.push(this.afAuth.auth.currentUser.updateEmail(email));
 updateOperations.push(this.afAuth.auth.currentUser.updatePassword(password));
 return Promise.all(updateOperations);
 }
 }*/

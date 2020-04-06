import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "firebase";
import {combineLatest, Observable} from "rxjs";
import {Todolist} from "../model/todolist";
import {flatMap, map} from "rxjs/operators";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Todo} from "../model/todo";
import {UserDB} from "../model/userDB";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private usersCollection: AngularFirestoreCollection<UserDB>;
    private users: Observable<Array<UserDB>>;
    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    }
    init(){
        this.usersCollection = this.db.collection<UserDB>('users');

        this.users = this.usersCollection.snapshotChanges().pipe(
            map(this.convertSnapshots));
    }
    convertSnapshots(snaps) {
        return snaps.map(snap => {
            return {
                id: snap.payload.doc.id,
                ...snap.payload.doc.data()
            };
        });
    }

    get(): User {
        return this.afAuth.auth.currentUser;
    }

    getUsers(): Observable<Array<UserDB>> {
return this.users;
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

    addUser(user:UserDB) {
        this.usersCollection.add(user);
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

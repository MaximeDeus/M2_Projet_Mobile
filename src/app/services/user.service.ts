import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "firebase";
import {Observable} from "rxjs";
import {Todolist} from "../model/todolist";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user:User
  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.auth.currentUser;
  }

  get(): User {
    return this.user;
  }

  login(email,password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}

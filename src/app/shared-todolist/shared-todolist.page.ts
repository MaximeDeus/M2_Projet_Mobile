import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Todolist} from "../model/todolist";
import {User} from "firebase";
import {TodoslistService} from "../services/todoslist.service";
import {UserService} from "../services/user.service";
import {AlertController} from "@ionic/angular";
import {UserDB} from "../model/userDB";

@Component({
  selector: 'app-shared-todolist',
  templateUrl: './shared-todolist.page.html',
  styleUrls: ['./shared-todolist.page.scss'],
})
export class SharedTodolistPage implements OnInit, OnDestroy {

  private todolists$: Observable<Array<Array<Todolist>>>;
  private allowReadTodolist: Array<Todolist>;
  private allowWriteTodolist: Array<Todolist>;
  private allowReadWriteTodolist: Array<Todolist>;
  private currentUser: User;
  private usersObservable: Observable<Array<UserDB>>;
  private users: Array<UserDB>;
  private subscriptionTodolists$: Subscription;
  private subscriptionUsersObservable: Subscription;


  constructor(private listService: TodoslistService,
              private userService: UserService,
              public alertCtrl: AlertController,
  ) {}

  /**
   * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
   */
  ngOnInit(): void {
    this.userService.init();
    this.currentUser = this.userService.get();
    this.usersObservable = this.userService.getUsers();
    this.subscriptionUsersObservable = this.usersObservable.subscribe(users => {
      this.users = users;
    })
    this.listService.init();
    this.todolists$ = this.listService.get();
    this.allowReadWriteTodolist = this.listService.getLatestReadWriteTodolist();
    this.subscriptionTodolists$ = this.todolists$.subscribe(todolists => {
      this.allowReadTodolist = todolists[1];
      this.allowWriteTodolist = todolists[2];
      this.allowReadTodolist = this.allowReadTodolist.filter(list => list.name.length !== 0);
      this.allowWriteTodolist = this.allowWriteTodolist.filter(list => list.name.length !== 0);

      // Merge read and write array and then remove duplicated elements (if both read/write)
      this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
          .concat(this.allowReadTodolist, this.allowWriteTodolist)
          .reduce((m, t) => m.set(t.name, t), new Map()).values());
    })
  }

  ngOnDestroy(): void {
    this.subscriptionTodolists$.unsubscribe();
    this.subscriptionUsersObservable.unsubscribe();
    this.allowReadWriteTodolist = null;
  }

  isCompleted(todolist: Todolist) {
    return todolist.todos.every(todo => todo.isDone);
  }

  countTodoDone(todolist: Todolist){
    return todolist.todos.filter(todo => todo.isDone).length;
  }

  async displayPromptAboutTodolist(todolist: Todolist) {
    let ownerTodolist = this.users.filter(user => user.uid == todolist.owner)[0].name;
      const alert = await this.alertCtrl.create({
        header: 'About',
        message: 'Owner : ' + ownerTodolist,
        buttons: ['OK']
      });

      await alert.present();
    }

  isAllowWrite(todolist: Todolist) {
    return todolist.allowWrite.filter(uid => uid == this.currentUser.uid).length > 0;
  }

  async displayPromptUpdateTodolist(todolist:Todolist) {
    let alert = await this.alertCtrl.create({
      header: 'Update Todolist',

      inputs: [
        {
          name: 'name',
          placeholder: 'My todolist',
          value:todolist.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.name) {
              todolist.name = data.name;
              this.listService.updateTodolist(todolist);
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
}

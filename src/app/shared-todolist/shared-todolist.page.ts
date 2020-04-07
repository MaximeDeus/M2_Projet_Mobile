import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Todolist} from "../model/todolist";
import {User} from "firebase";
import {TodoslistService} from "../services/todoslist.service";
import {UserService} from "../services/user.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-shared-todolist',
  templateUrl: './shared-todolist.page.html',
  styleUrls: ['./shared-todolist.page.scss'],
})
export class SharedTodolistPage implements OnInit {

  private todolists$: Observable<Array<Array<Todolist>>>;
  private ownerTodolist: Array<Todolist>;
  private allowReadTodolist: Array<Todolist>;
  private allowWriteTodolist: Array<Todolist>;
  private allowReadWriteTodolist: Array<Todolist>;
  private currentUser: User;


  constructor(private listService: TodoslistService,
              private userService: UserService,
              public alertCtrl: AlertController,
  ) {

    this.currentUser = userService.get();
    console.log("Current user : " + JSON.stringify(this.currentUser));
  }

  /**
   * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
   */
  ngOnInit(): void {

    this.todolists$ = this.listService.get();
    this.allowReadWriteTodolist = this.listService.getLatestReadWriteTodolist();
    this.todolists$.subscribe(todolists => {
      this.ownerTodolist = todolists[0];
      this.allowReadTodolist = todolists[1];
      this.allowWriteTodolist = todolists[2];

      // Merge read and write array and then remove duplicated elements (if both read/write)
      this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
          .concat(this.allowReadTodolist, this.allowWriteTodolist)
          .reduce((m, t) => m.set(t.name, t), new Map()).values());
      console.log('this.ownerTodolist : ', JSON.stringify(this.ownerTodolist));
      console.log('allowReadTodolist : ', JSON.stringify(this.allowReadTodolist));
      console.log('this.allowWriteTodolist : ', JSON.stringify(this.allowWriteTodolist));
      console.log('this.allowReadWriteTodolist : ', JSON.stringify(this.allowReadWriteTodolist));
    })
  }

  isCompleted(todolist: Todolist) {
    return todolist.todos.every(todo => todo.isDone);
  }

  countTodoDone(todolist: Todolist){
    return todolist.todos.filter(todo => todo.isDone).length;
  }
// TODO quand logout, setter var à undefined (pour le rafraichissement)
  // TODO ajouter icone read/write
  // TODO ajouter nom owner
  // TODO metre à jour vue todo
  // TODO rafraichir vue quand changement util.
  // TODO nettoyer les unsubscribe
  // TODO essayer corriger menu
  // TODO nettoyer code

}

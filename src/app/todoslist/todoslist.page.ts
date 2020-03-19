import {Component, OnInit} from '@angular/core';
import {Todo} from '../model/todo';
import {TodoslistService} from '../services/todoslist.service';
import {Observable} from 'rxjs';
import {Todolist} from "../model/todolist";
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from "firebase";
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-todoslist',
    templateUrl: './todoslist.page.html',
    styleUrls: ['./todoslist.page.scss'],
})
export class TodoslistPage implements OnInit {
    private todolists$: Observable<Array<Array<Todolist>>>;
    private ownerTodolist: Array<Todolist>;
    private allowReadTodolist: Array<Todolist>;
    private allowWriteTodolist: Array<Todolist>;
    private allowReadWriteTodolist: Array<Todolist>;
    private currentUser: User;

    constructor(private listService: TodoslistService, private userService: UserService) {

        this.currentUser = userService.get();
        console.log("Welcome back " + JSON.stringify(this.currentUser));
    }

    /**
     * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
     */
    ngOnInit(): void {

        this.todolists$ = this.listService.get();
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

    /**
     TODO MUST BE DONE
     delete(todo: Todo){
    this.listService.delete(todo);
  }
     delete(todolist: Todolist){
    this.listService.delete(todolist);
  }
     */
}

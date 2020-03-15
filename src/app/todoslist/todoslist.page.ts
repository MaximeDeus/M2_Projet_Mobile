import { Component, OnInit } from '@angular/core';
import { Todo } from '../model/todo';
import { TodoslistService } from '../services/todoslist.service';
import { Observable } from 'rxjs';
import {Todolist} from "../model/todolist";

@Component({
  selector: 'app-todoslist',
  templateUrl: './todoslist.page.html',
  styleUrls: ['./todoslist.page.scss'],
})
export class TodoslistPage implements OnInit {
  private todolists$: Observable<Array<Array<Todolist>>>;
  private ownerTodolist:Array<Todolist>;
  private allowReadTodolist:Array<Todolist>;
  private allowWriteTodolist:Array<Todolist>;


  constructor(private listService: TodoslistService) {}

  ngOnInit(): void {
    this.todolists$ = this.listService.get();
    this.todolists$.subscribe(todolists => {
    // console.log('this.todolists$ inside = ' , JSON.stringify(this.todolists$));
    this.ownerTodolist = todolists[0];
      // console.log('this.ownertodolist inside = ' , JSON.stringify(this.ownerTodolist));
      // console.log('value = ' , JSON.stringify(value));
    this.allowReadTodolist = todolists[1];
    this.allowWriteTodolist = todolists[2];
        // Display data in html file
  })
    console.log ('this.todolists$ outside = ' , this.todolists$);
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

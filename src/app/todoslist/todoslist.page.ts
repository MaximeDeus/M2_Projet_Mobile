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

  /**
   * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
   */
  ngOnInit(): void {
    this.todolists$ = this.listService.get();
    this.todolists$.subscribe(todolists => {
    this.ownerTodolist = todolists[0];
    this.allowReadTodolist = todolists[1];
    this.allowWriteTodolist = todolists[2];
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

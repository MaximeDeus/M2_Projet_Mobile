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
// TODO Create Todolist model (field : todos : Arraylist<Todo>) OK must be tested
  // TODO change todos type : Observable<Array<Todolist>> OK must be tested
  private todolists$: Observable<Array<Todolist>>;

  constructor(private listService: TodoslistService) {}

  ngOnInit(): void {
    this.todolists$ = this.listService.get();
    // TODO iterate of each list
    // TODO display nameList, all orderer todos (1,2..,length) and owner of the list
    // TODO uncomment !!! console.log('liste des todo' , this.todolists$.subscribe(todo => console.log(todo)));
  }  
/**
  delete(todo: Todo){
    this.listService.delete(todo);
  }
 */
}

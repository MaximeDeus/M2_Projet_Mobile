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
  private todolists$: Observable<Array<Todolist>>;

  constructor(private listService: TodoslistService) {}

  ngOnInit(): void {
    this.todolists$ = this.listService.get();
    // Display data in html file
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

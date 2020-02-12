import { Component, OnInit } from '@angular/core';
import { Todo } from '../model/todo';
import { TodoslistService } from '../services/todoslist.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todoslist',
  templateUrl: './todoslist.page.html',
  styleUrls: ['./todoslist.page.scss'],
})
export class TodoslistPage implements OnInit {

  private todos$: Observable<Array<Todo>>;

  constructor(private listService: TodoslistService) {}

  ngOnInit(): void {
    this.todos$ = this.listService.get();
  }  

  delete(todo: Todo){
    this.listService.delete(todo);
  }
}

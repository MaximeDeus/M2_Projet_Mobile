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
// TODO Create Todolist model (field : todos : Arraylist<Todo>)
  // TODO change todos type : Observable<Array<Todolist>>
  private todos$: Observable<Array<Todo>>;

  constructor(private listService: TodoslistService) {}

  ngOnInit(): void {
    this.todos$ = this.listService.get();
    // TODO iterate of each list
    // TODO display nameList, all orderer todos (1,2..,length) and owner of the list
    console.log('liste des todo' , this.todos$.subscribe(todo => console.log(todo)));
  }  

  delete(todo: Todo){
    this.listService.delete(todo);
  }
}

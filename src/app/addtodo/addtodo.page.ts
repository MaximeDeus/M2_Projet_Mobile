import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from '../model/todo';
import { TodoslistService } from '../services/todoslist.service';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  title: string;

  constructor(private listService: TodoslistService,
    private router: Router) { }

  ngOnInit() {
  }

  addList(){
    let item = { title: this.title, isDone: false } as Todo;
    this.listService.add(item);
    this.router.navigate(['']);
  }
}

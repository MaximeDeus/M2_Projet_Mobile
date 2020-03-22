import { Component, OnInit } from '@angular/core';
import {Todolist} from "../model/todolist";
import {ActivatedRoute} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";
import {Todo} from "../model/todo";

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  private id: string;
  private todolist:Todolist;

  constructor(private todolistService: TodoslistService , private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // TODO this.todolist = this.todolistService.getTodolist(this.id);
    this.todolistService.get().subscribe(todolists => {
      let mergedTodolists: Array<Todolist> = [].concat.apply([], todolists);
      // let unique = [...new Set(names)];
      console.log ('todolists :' , JSON.stringify(todolists));
      console.log ('mergedTodolists :' , JSON.stringify(mergedTodolists));
      console.log ('this.todolist avant :' , JSON.stringify(this.todolist));
      this.todolist = mergedTodolists.find(todolist => todolist.id === this.id);
      console.log ('this.todolist après :' , JSON.stringify(this.todolist));
    })

    // this.todolist = {allowRead: undefined, allowWrite: undefined, id: "", name: "", owner: "", todos: undefined};
  }
    delete(todo: Todo){
        this.todolistService.deleteTodo(todo,this.id);
    }
}

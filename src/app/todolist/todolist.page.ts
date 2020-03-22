import { Component, OnInit } from '@angular/core';
import {Todolist} from "../model/todolist";
import {ActivatedRoute} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";
import {Todo} from "../model/todo";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  private id: string;
  private todolist:Todolist;

  constructor(private todolistService: TodoslistService , private route: ActivatedRoute,public alertCtrl: AlertController) {}

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

  async displayPromptAddTodo() {
    let alert = await this.alertCtrl.create({
      header: 'New Todo',

      inputs: [
        {
          name: 'name',
          placeholder: 'Exercise 2 p.47',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create Todo',
          handler: data => {
            if (data.name) {
              const todo = this.createTodo(data.name);
              this.todolistService.addTodo(todo,this.id).then(res => {
              })
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private createTodo(name: string): Todo {
    const todo: Todo =
        {
          isDone: false,
          title: name
        }
    return todo;
  }
}

import {Component, OnInit} from '@angular/core';
import {Todolist} from "../model/todolist";
import {ActivatedRoute,  Router} from "@angular/router";
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
  private todolist:Todolist = {
    allowRead: [],
    allowWrite: [],
    name: "",
    owner: "",
    todos : []}

  constructor(private router: Router, private todolistService: TodoslistService , private route: ActivatedRoute,public alertCtrl: AlertController) {}

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');
    this.todolistService.getTodolist(this.id).subscribe(todolist => {
      console.log('value : ', JSON.stringify(todolist));
      this.todolist = todolist;
    })
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

  updateTodo(todo: Todo, todoID: string) {
    todo.isDone = !todo.isDone;
    this.todolistService.updateTodo(todo,todoID,this.id);
  }
}

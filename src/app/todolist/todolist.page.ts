import {Component, OnInit} from '@angular/core';
import {Todolist} from "../model/todolist";
import {ActivatedRoute,  Router} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";
import {Todo} from "../model/todo";
import {AlertController} from "@ionic/angular";
import {User} from "firebase";
import {UserService} from "../services/user.service";

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

  private currentUser: User;

  constructor(
      private router: Router,
      private todolistService: TodoslistService ,
      private route: ActivatedRoute,
      private userService: UserService,
      public alertCtrl: AlertController) {}

  ngOnInit() {
    this.userService.init();
    this.currentUser = this.userService.get();
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

  isAllowWrite(todolist: Todolist) {
    return todolist.allowWrite.filter(uid => uid == this.currentUser.uid).length > 0 ||
        this.currentUser.uid == this.todolist.owner;
  }

  updateTodoCheckBox(todo: Todo) {
    if (this.isAllowWrite(this.todolist)){
    todo.isDone = !todo.isDone;
    this.todolistService.updateTodo(todo,this.id);
    }
  }

  async displayPromptUpdateTodo(todo:Todo) {
    let alert = await this.alertCtrl.create({
      header: 'Update Todo',

      inputs: [
        {
          name: 'name',
          placeholder: 'My todo',
          value:todo.title
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.name) {
              todo.title = data.name;
              this.todolistService.updateTodo(todo,this.id);
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoslistService} from '../services/todoslist.service';
import {Observable, Subscription} from 'rxjs';
import {Todolist} from "../model/todolist";
import {User} from "firebase";
import {UserService} from "../services/user.service";
import {AlertController} from "@ionic/angular";


@Component({
    selector: 'app-todoslist',
    templateUrl: './todoslist.page.html',
    styleUrls: ['./todoslist.page.scss'],
})
export class TodoslistPage implements OnInit, OnDestroy {
    private todolists$: Observable<Array<Array<Todolist>>>;
    private ownerTodolist: Array<Todolist>;
    private allowReadTodolist: Array<Todolist>;
    private allowWriteTodolist: Array<Todolist>;
    private allowReadWriteTodolist: Array<Todolist>;
    private currentUser: User;
    private subscriptionTodolists$: Subscription;


    constructor(private listService: TodoslistService,
                private userService: UserService,
                public alertCtrl: AlertController,
                ) {}

    /**
     * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
     */
    ngOnInit(): void {
        console.log("NGONINIT");
        this.currentUser = this.userService.get();
        console.log("Current user : " + JSON.stringify(this.currentUser));
        this.ownerTodolist = this.listService.getLatestOwnerTodolist();
        console.log('owner todolist : ' , this.ownerTodolist);
        this.todolists$ = this.listService.get();
        console.log ('observable todolist : ' , this.todolists$);
        this.subscriptionTodolists$ = this.todolists$.subscribe(todolists => {
            console.log('SUBSCRIBE');
            this.ownerTodolist = todolists[0];
            this.allowReadTodolist = todolists[1];
            this.allowWriteTodolist = todolists[2];

            // Merge read and write array and then remove duplicated elements (if both read/write)
            this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
                .concat(this.allowReadTodolist, this.allowWriteTodolist)
                .reduce((m, t) => m.set(t.name, t), new Map()).values());
            console.log('this.ownerTodolist : ', JSON.stringify(this.ownerTodolist));
            console.log('allowReadTodolist : ', JSON.stringify(this.allowReadTodolist));
            console.log('this.allowWriteTodolist : ', JSON.stringify(this.allowWriteTodolist));
            console.log('this.allowReadWriteTodolist : ', JSON.stringify(this.allowReadWriteTodolist));
        })
    }

    ngOnDestroy(): void {
        console.log("NG ON DESTROY");
        console.log("closed : " , this.subscriptionTodolists$.closed);
        this.subscriptionTodolists$.unsubscribe();
    }
/**
    ionViewWillEnter(){
        console.log("IONVIEWWILLENTER");
        this.currentUser = this.userService.get();
        console.log("Current user : " + JSON.stringify(this.currentUser));
        this.ownerTodolist = this.listService.getLatestOwnerTodolist();
        console.log('owner todolist : ' , this.ownerTodolist);
        this.todolists$ = this.listService.get();
        console.log ('observable todolist : ' , this.todolists$);
        this.subscription = this.todolists$.subscribe(todolists => {
            console.log('SUBSCRIBE');
            this.ownerTodolist = todolists[0];
            this.allowReadTodolist = todolists[1];
            this.allowWriteTodolist = todolists[2];

            // Merge read and write array and then remove duplicated elements (if both read/write)
            this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
                .concat(this.allowReadTodolist, this.allowWriteTodolist)
                .reduce((m, t) => m.set(t.name, t), new Map()).values());
            console.log('this.ownerTodolist : ', JSON.stringify(this.ownerTodolist));
            console.log('allowReadTodolist : ', JSON.stringify(this.allowReadTodolist));
            console.log('this.allowWriteTodolist : ', JSON.stringify(this.allowWriteTodolist));
            console.log('this.allowReadWriteTodolist : ', JSON.stringify(this.allowReadWriteTodolist));
        })
    }
 */
/**
    ionViewWillLeave(){
        console.log("IONVIEWWILLLEAVE");
        this.subscription.unsubscribe();
    }
 */

    async displayPromptAddTodolist() {
        let alert = await this.alertCtrl.create({
            header: 'New Todolist',

            inputs: [
                {
                    name: 'name',
                    placeholder: 'Do my Homeworks',
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Create Todolist',
                    handler: data => {
                        if (data.name) {
                            const todolist = this.createTodolist(data.name);
                            this.listService.addTodolist(todolist).then(res => {
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

    private createTodolist(name: string): Todolist {
        const todolist: Todolist =
            {
                allowRead: [],
                allowWrite: [],
                name: name,
                owner: this.currentUser.uid,
                todos: []
            }
        return todolist;
    }

    delete(todolist: Todolist){
        this.listService.deleteTodolist(todolist);
    }

    isCompleted(todolist: Todolist) {
        return todolist.todos.every(todo => todo.isDone);
    }

    countTodoDone(todolist: Todolist){
        return todolist.todos.filter(todo => todo.isDone).length;
    }
}

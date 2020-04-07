import {Component, OnDestroy, OnInit} from '@angular/core';
import {TodoslistService} from '../services/todoslist.service';
import {Observable, Subscription} from 'rxjs';
import {Todolist} from "../model/todolist";
import {User} from "firebase";
import {UserService} from "../services/user.service";
import {AlertController} from "@ionic/angular";
import {UserDB} from "../model/userDB";


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
    private subscriptionUsersObservable: Subscription;
    private onInitState = true;
    private usersObservable: Observable<Array<UserDB>>;
    private users: Array<UserDB>;


    constructor(private listService: TodoslistService,
                private userService: UserService,
                public alertCtrl: AlertController,
    ) {
    }

    /**
     * Get an observable and set/update the 3 todolists (owner, allowR, allowW)
     */
    ngOnInit(): void {
        this.userService.init();
        this.currentUser = this.userService.get();
        this.usersObservable = this.userService.getUsers();
        this.subscriptionUsersObservable = this.usersObservable.subscribe(users => {
            this.users = users;
        })
        this.listService.init();
        this.todolists$ = this.listService.get();
        this.subscriptionTodolists$ = this.todolists$.subscribe(todolists => {
            this.ownerTodolist = todolists[0];
            this.allowReadTodolist = todolists[1];
            this.allowWriteTodolist = todolists[2];
            this.ownerTodolist = this.ownerTodolist.filter(list => list.name.length !== 0);
            this.allowReadTodolist = this.allowReadTodolist.filter(list => list.name.length !== 0);
            this.allowWriteTodolist = this.allowWriteTodolist.filter(list => list.name.length !== 0);

            // Merge read and write array and then remove duplicated elements (if both read/write)
            this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
                .concat(this.allowReadTodolist, this.allowWriteTodolist)
                .reduce((m, t) => m.set(t.name, t), new Map()).values());
            })
    }

    ngOnDestroy(): void {
        this.subscriptionTodolists$.unsubscribe();
        this.subscriptionUsersObservable.unsubscribe();
    }


     ionViewWillEnter(){
        if (this.onInitState){
            this.onInitState = false;
        }
        else{
            this.userService.init();
            this.currentUser = this.userService.get();
            this.usersObservable = this.userService.getUsers();
            this.usersObservable.subscribe(users => {
                this.users = users;
            })
            this.listService.init();
            this.todolists$ = this.listService.get();
            this.subscriptionTodolists$ = this.todolists$.subscribe(todolists => {
                this.ownerTodolist = todolists[0];
                this.allowReadTodolist = todolists[1];
                this.allowWriteTodolist = todolists[2];
                this.ownerTodolist = this.ownerTodolist.filter(list => list.name.length !== 0);
                this.allowReadTodolist = this.allowReadTodolist.filter(list => list.name.length !== 0);
                this.allowWriteTodolist = this.allowWriteTodolist.filter(list => list.name.length !== 0);

                // Merge read and write array and then remove duplicated elements (if both read/write)
                this.allowReadWriteTodolist = Array.from(this.allowReadTodolist
                    .concat(this.allowReadTodolist, this.allowWriteTodolist)
                    .reduce((m, t) => m.set(t.name, t), new Map()).values());
                })
    }}

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

    async displayPromptUpdateTodolist(todolist:Todolist) {
        let alert = await this.alertCtrl.create({
            header: 'Update Todolist',

            inputs: [
                {
                    name: 'name',
                    placeholder: 'My todolist',
                    value:todolist.name
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
                            todolist.name = data.name;
                            this.listService.updateTodolist(todolist);
                        } else {
                            return false;
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    delete(todolist: Todolist) {
        this.listService.deleteTodolist(todolist);
    }

    isCompleted(todolist: Todolist) {
        return todolist.todos.every(todo => todo.isDone);
    }

    countTodoDone(todolist: Todolist) {
        return todolist.todos.filter(todo => todo.isDone).length;
    }

    buildInputWrite(user: UserDB, todolist:Todolist) {
        // Can't share with ourself
        if (user.uid !== this.currentUser.uid){
        const isSharedWriteWithUser = todolist.allowWrite.filter(uid => uid === user.uid).length > 0;
        return {
            name:  user.name,
            type: 'checkbox',
            label: user.name,
            value: user.uid,
            checked: isSharedWriteWithUser
        }
        }
        // will be filtered
    }

    async displayPromptAllowWriteTodolist(todolist:Todolist) {
        const input:any = this.users.map((user) => this.buildInputWrite(user,todolist))
            .filter(user => user !== undefined);
        const alert = await this.alertCtrl.create({
            header: 'Share Write with',
            inputs: input,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                       }
                }, {
                    text: 'Ok',
                    handler: data => {
                       {
                           todolist.allowWrite = data;
                            this.listService.updateTodolist(todolist);
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    buildInputRead(user: UserDB, todolist:Todolist) {
        // Can't share with ourself
        if (user.uid !== this.currentUser.uid){
            const isSharedReadWithUser = todolist.allowRead.filter(uid => uid === user.uid).length > 0;
            return {
                name:  user.name,
                type: 'checkbox',
                label: user.name,
                value: user.uid,
                checked: isSharedReadWithUser
            }
        }
        // will be filtered
    }

    async displayPromptAllowReadTodolist(todolist:Todolist) {
        const input:any = this.users.map((user) => this.buildInputRead(user,todolist))
            .filter(user => user !== undefined);
        const alert = await this.alertCtrl.create({
            header: 'Share read with',
            inputs: input,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: 'Ok',
                    handler: data => {
                        {
                            todolist.allowRead = data;
                            this.listService.updateTodolist(todolist);
                        }
                    }
                }
            ]
        });
        await alert.present();
    }
}

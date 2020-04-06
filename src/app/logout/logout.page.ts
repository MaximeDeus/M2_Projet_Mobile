
import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";
import {Observable, Subscription} from "rxjs";
import {Todolist} from "../model/todolist";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.page.html',
    styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
    private refSubscriptionMergedTodolist: Subscription;

    constructor(private userService: UserService, private listService: TodoslistService,private router: Router) {
    }

    ngOnInit() {
        this.refSubscriptionMergedTodolist = this.listService.getRefSubscriptionMergedTodolist();
        console.log (this.refSubscriptionMergedTodolist);
        this.refSubscriptionMergedTodolist.unsubscribe();
        console.log (this.refSubscriptionMergedTodolist);
        this.userService.logout().then(() => {
            this.router.navigate(['auth']);
        });

    }
}

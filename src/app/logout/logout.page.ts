import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {TodoslistService} from "../services/todoslist.service";
import { Subscription} from "rxjs";

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
        this.refSubscriptionMergedTodolist.unsubscribe();
        this.userService.logout().then(() => {
            this.router.navigate(['auth']);
        });

    }
}

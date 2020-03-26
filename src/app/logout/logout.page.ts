import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.page.html',
    styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
        this.userService.logout().then(() => {
            this.router.navigate(['']);
        });

    }
}

import {Component, Input, OnInit} from '@angular/core';
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  private navigate : any;
  @Input() idMenu : string;
  
  constructor(private menu: MenuController) { }

  ngOnInit() {
    this.sideMenu();

  }
  // src : https://petercoding.com/ionic/2019/05/05/side-menu-in-ionic4/
  sideMenu()
  {
    this.navigate =
        [
          {
            title : "My todolists",
            url   : "/todoslist",
            icon  : "checkmark-circle-outline"
          },
          {
            title : "Shared with me",
            url   : "/sharedTodolist",
            icon  : "people"
          },
          {
            title : "Settings",
            url   : "/settings",
            icon  : "settings"
          },
          {
            title : "Logout",
            url   : "/logout",
            icon  : "log-out"
          },
        ]
  }
}

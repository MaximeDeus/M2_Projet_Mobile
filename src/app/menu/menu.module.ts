import {NgModule} from "@angular/core";
import {MenuComponent} from "./menu.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule
    ],
    exports: [
        MenuComponent
    ],
    declarations: [MenuComponent]
})

export class MenuModule {}

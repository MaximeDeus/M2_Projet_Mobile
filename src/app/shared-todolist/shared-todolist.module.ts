import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedTodolistPageRoutingModule } from './shared-todolist-routing.module';

import { SharedTodolistPage } from './shared-todolist.page';
import {MenuModule} from "../menu/menu.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedTodolistPageRoutingModule,
        MenuModule
    ],
  declarations: [SharedTodolistPage]
})
export class SharedTodolistPageModule {}

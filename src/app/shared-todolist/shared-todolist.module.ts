import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedTodolistPageRoutingModule } from './shared-todolist-routing.module';

import { SharedTodolistPage } from './shared-todolist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedTodolistPageRoutingModule
  ],
  declarations: [SharedTodolistPage]
})
export class SharedTodolistPageModule {}

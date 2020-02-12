import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoslistPageRoutingModule } from './todoslist-routing.module';

import { TodoslistPage } from './todoslist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodoslistPageRoutingModule
  ],
  declarations: [TodoslistPage]
})
export class TodoslistPageModule {}

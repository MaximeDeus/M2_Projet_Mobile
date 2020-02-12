import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoslistPage } from './todoslist.page';

const routes: Routes = [
  {
    path: '',
    component: TodoslistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoslistPageRoutingModule {}

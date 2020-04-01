import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedTodolistPage } from './shared-todolist.page';

const routes: Routes = [
  {
    path: '',
    component: SharedTodolistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedTodolistPageRoutingModule {}

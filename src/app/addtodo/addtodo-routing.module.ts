import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddtodoPage } from './addtodo.page';

const routes: Routes = [
  {
    path: '',
    component: AddtodoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddtodoPageRoutingModule {}

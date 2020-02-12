import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['todoslist']); // TODO must be 'auth' value

const routes: Routes = [
  { path: '', redirectTo: 'todoslist', pathMatch: 'full' },
  {
    path: 'todoslist',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin},
    loadChildren: () => import('./todoslist/todoslist.module').then( m => m.TodoslistPageModule)

},
  {
    path: 'addtodo',
    loadChildren: () => import('./addtodo/addtodo.module').then( m => m.AddtodoPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { Todo } from '../model/todo';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoslistService {

  private todosCollection: AngularFirestoreCollection<Todo>;

  private todos: Observable<Array<Todo>>;
  
  constructor(private db: AngularFirestore) {
    // console.log('toto')
    // TODO iterate on collection list
    // TODO for each doc ('listId'), filter with owner and shared lists
    // TODO return all filtered list (Array of Todolist containing Array of todo)
    // TODO add field name (of the list) on list collection

    this.todosCollection = db.collection<Todo>('list').doc('{listId}').collection('item');
    this.todos = this.todosCollection.snapshotChanges().pipe(
      map(actions => {
        // console.log('titi');
        return actions.map(a => {
          const data = a.payload.doc.data();
          console.log ("data = ", data);
          const id = a.payload.doc.id;
          console.log ("id = ", id);
          return { id, ...data };
        });
      })
    );
  }
  
  get(): Observable<Array<Todo>> {
    return this.todos;
  }

  add(todo: Todo) {
    return this.todosCollection.add(todo);
  }

  delete(todo: Todo){
    return this.todosCollection.doc(todo.id).delete();
  }

}

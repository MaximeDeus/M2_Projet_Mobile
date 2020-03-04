import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Todolist} from "../model/todolist";
import {Todo} from "../model/todo";
import {toTitleCase} from "codelyzer/util/utils";

@Injectable({
    providedIn: 'root'
})
export class TodoslistService {

    private todolistsCollection: AngularFirestoreCollection<Todolist>;
    private todolists: Observable<Array<Todolist>>;
    private items: Array<Todo>;

    constructor(private db: AngularFirestore) {
        // return all list (Array of Observable Todolist containing Array of todo)
        // TODO implements user filtering
        // TODO implements shared lists
        // Load collection containing all todolist document
        this.todolistsCollection = db.collection<Todolist>('list');
        this.todolists = this.todolistsCollection.snapshotChanges().pipe(
            map(this.convertSnapshots), // data of each todolist
            map((allTodolistDatas:Todolist[]) => allTodolistDatas.
            map(allTodolistDatas => this.todolistsCollection.doc(allTodolistDatas.id).collection<Todo>('item').snapshotChanges().pipe( // rename parameter to todolistDatas ?
            map(this.convertSnapshots),
            map((allTodosDatas:Array<Todo>) => Object.assign(allTodolistDatas, {['todos']: allTodosDatas})
            )
        ))
    ),
            flatMap(combined => combineLatest(combined))
            );
    }
    convertSnapshots<T> (snaps) {
        return <T[]>snaps.map(snap => {
            return {
                id: snap.payload.doc.id,
            ...snap.payload.doc.data()
        };
        });
    }

    get(): Observable<Array<Todolist>> {
        return this.todolists;
    }

    addTodolist(todolist: Todolist) {
        return this.todolistsCollection.add(todolist);
    }

    addTodo(todo: Todo, todolistID: string) {
        return this.todolistsCollection.doc(todolistID).collection('item').add(todo);
    }

    deleteTodolist(todolist: Todolist) {
        return this.todolistsCollection.doc(todolist.id).delete();
    }

    deleteTodo(todo: Todo, todolistID: string) {
        return this.todolistsCollection.doc(todolistID).collection('item').doc(todo.id).delete();
    }

}

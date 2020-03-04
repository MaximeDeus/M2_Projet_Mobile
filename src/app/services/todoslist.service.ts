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
    /**
     static async init (db: AngularFirestore){

    const itemSnapshot = await db.collection('list').doc('KebhTsvaUOwzR2kjbMry').collection('item').get();
          const items = itemSnapshot.forEach(doc => console.log('doc : ', doc));
          console.log('itemSnapshot : ', itemSnapshot);
    /**
    db.collection('list').doc('KebhTsvaUOwzR2kjbMry').collection('item').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });


    const items = db.collection('list').doc('KebhTsvaUOwzR2kjbMry');
        console.log ('items :' + JSON.stringify(items));
}
     */

    private todolistsCollection: AngularFirestoreCollection<Todolist>;
    private todolists: Observable<Array<Todolist>>;
    private items: Array<Todo>;

    constructor(private db: AngularFirestore) {
        // TODO return all filtered list (Array of Todolist containing Array of todo)
        console.log('constructeur TodolistService');
        console.log('récupération collection list contenant les documents de Todolist');
        this.todolistsCollection = db.collection<Todolist>('list');
        console.log('Récupération des id/données de chaque Todolist (documents collection list)...');
        this.todolists = this.todolistsCollection.snapshotChanges().pipe(
            map(this.convertSnapshots), // Récupération des données de chaque document de la collection list (i.e des Todolist)
            map((allTodolistDatas:Todolist[]) => allTodolistDatas.
            map(allTodolistDatas => this.todolistsCollection.doc(allTodolistDatas.id).collection<Todo>('item').snapshotChanges().pipe( // rename parameter to todolistDatas ?
            map(this.convertSnapshots),
            map((allTodosDatas:Array<Todo>) => Object.assign(allTodolistDatas, {['todos']: allTodosDatas})
            )
        ))
    ),
            flatMap(combined => combineLatest(combined))
            );
        console.log ('todolist : '+ JSON.stringify(this.todolists));
    }
            /**
            map(actions => {
                return actions.map(a => {
                    console.log("a :", a);
                    const id = a.payload.doc.id;
                    console.log("id = ", id);
                    // TODO for each doc filter with owner (and shared lists ?)
                    const todolist = a.payload.doc.data();
                    console.log("todolist = ", todolist);
                    return {id, ...todolist};
                })}),
            map (todolists => {
                todolists.map (todolist => {
                    this.todolistsCollection.doc(todolist.id).collection('item').snapshotChanges().pipe(
                        map(actions => {
                            return actions.map(a => {
                                    console.log("a :", a);
                                    const id = a.payload.doc.id;
                                    console.log("id = ", id);
                                    // TODO for each doc filter with owner (and shared lists ?)
                                    const item = a.payload.doc.data();
                                    console.log("item = ", item);
                                    return {id, ...item};
                                }
                            )
                        }))})
                }))};
             */

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
        // TODO delete this mocked object
        /**
         const todolist: Todolist = {
      id: "", name: "", owner: "", todos: undefined

    }
         */
            // TodoslistService.init(this.db);
        let mockTodo = {
                id: "1234", isDone: false, title: "TEST"
            }
        let mockTodolistID = 'KebhTsvaUOwzR2kjbMry';
        return this.todolistsCollection.doc(mockTodolistID).collection('item').add(mockTodo);
    }

    delete(todolist: Todolist) {
        return this.todolistsCollection.doc(todolist.id).delete();
    }

}

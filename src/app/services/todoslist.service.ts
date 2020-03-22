import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Todolist} from "../model/todolist";
import {Todo} from "../model/todo";
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from "firebase";

@Injectable({
    providedIn: 'root'
})
export class TodoslistService {
    private todolistsCollection: AngularFirestoreCollection<Todolist>;
    private ownerQuery: AngularFirestoreCollection<Todolist>;
    private allowReadQuery: AngularFirestoreCollection<Todolist>;
    private allowWriteQuery: AngularFirestoreCollection<Todolist>;
    private todolistsQueries: Array<AngularFirestoreCollection<Todolist>>;
    private todolists: Array<Observable<Array<Todolist>>>;
    private mergedTodolists: Observable<Array<Array<Todolist>>>;
    private user:User

    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        this.user = afAuth.auth.currentUser; // TODO move inside if
        /** TODO
         if (user) {
            // User is signed in.
        } else {
            // No user is signed in.
        }
         */

        // Used to communicate with DB (for CRUD operations (good practice ?)
        this.todolistsCollection = db.collection<Todolist>('list');

        this.ownerQuery = db.collection<Todolist>('list', ref =>
            ref.where('owner', '==', this.user.email));
        this.allowReadQuery = db.collection<Todolist>('list', ref =>
            ref.where("allowRead", "array-contains", this.user.uid));
        this.allowWriteQuery = db.collection<Todolist>('list', ref =>
            ref.where("allowWrite", "array-contains", this.user.uid));

        this.todolistsQueries = [
            this.ownerQuery,
            this.allowReadQuery,
            this.allowWriteQuery
        ];

        /**
         * Each query is used to Create an observable containing an
         * array of todolist Model
         * (todolist data are parsed using convertSnapshot inside convertQuery)
         *
         */
        this.todolists = this.todolistsQueries.map((query => {
            const res = this.convertQuery(query);
            return res;
        }));

        /**
         * Merge all observables from todolists
         * Contains an observable of an array containing the 3 arrays todolists
         * (owner arr., allowR arr., allowW arr.)
         */
        this.mergedTodolists = combineLatest(this.todolists);
    }

    /**
     * return an observable of todolist
     * data are parsed using convertsnapshot
     *
     * @param query : firestoreCollection reference
     */
    convertQuery(query: AngularFirestoreCollection<Todolist>): Observable<Array<Todolist>> {

        return query.snapshotChanges().pipe(
            map(this.convertSnapshots), // data of each todolist
            map((allTodolistDatas: Todolist[]) => allTodolistDatas.map(allTodolistDatas => query.doc(allTodolistDatas.id).collection<Todo>('item').snapshotChanges().pipe( // rename parameter to todolistDatas ?
                map(this.convertSnapshots),
                map((allTodosDatas: Array<Todo>) => Object.assign(allTodolistDatas, {['todos']: allTodosDatas})
                )
                ))
            ),
            flatMap(combined => combineLatest(combined))
        );
    }

    /**
     * a generic method used to parse generics datas from angularFSC snapshot
     *
     * @param snap : datas from angular FirestoreCollection
     */
    convertSnapshots<T>(snaps) {
        return <T[]>snaps.map(snap => {
            return {
                id: snap.payload.doc.id,
                ...snap.payload.doc.data()
            };
        });
    }

    /**
     * return todolist based on id
     */
    getTodolist(id:string): // TODO Observable<Todolist> {
    void {
        // TODO
        return null;
    }

    /**
     * return observable of the 3 arrays (owner, allowR, allowR)
     */
    get(): Observable<Array<Array<Todolist>>> {
        return this.mergedTodolists;
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

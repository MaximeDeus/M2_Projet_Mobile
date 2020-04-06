import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Todolist} from "../model/todolist";
import {Todo} from "../model/todo";
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from "firebase";
import * as firebase from "firebase";

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
    private user: User;
    private initLatestReadWriteTodolist: Array<Todolist>;
    private initLatestOwnerTodolist: Array<Todolist>;
    private refSubscriptionMergedTodolist: Subscription;
    private refSubscriptionAllSnapshots: any;

    // TODO important ! try to move constructor content inside init method called from page component (ex: todoslist)
    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    }

    init() {
        try {
            this.user = this.afAuth.auth.currentUser;
            // Used to communicate with DB (for CRUD operations (good practice ?)
            this.todolistsCollection = this.db.collection<Todolist>('list');

            this.ownerQuery = this.db.collection<Todolist>('list', ref =>
                ref.where('owner', '==', this.user.uid));
            this.allowReadQuery = this.db.collection<Todolist>('list', ref =>
                ref.where("allowRead", "array-contains", this.user.uid));
            this.allowWriteQuery = this.db.collection<Todolist>('list', ref =>
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
            /**
             * Used for sharing datas between Todoslist and shared todolist
             * (snapshot not triggered when using redirection)
             */
            console.log("BEFORE MERGED TODOLIST");
            this.refSubscriptionMergedTodolist = this.mergedTodolists.subscribe(todolists => {
                // this.mergedTodolists.subscribe(todolists => {
                console.log('mergedtodolist : this.initLatestOwnerTodolist = ', this.initLatestOwnerTodolist);
                this.initLatestOwnerTodolist = todolists[0];

                const allowReadTodolist = todolists[1];
                const allowWriteTodolist = todolists[2];

                // Concat and Merge read and write array and then remove duplicated elements (if both read/write)
                this.initLatestReadWriteTodolist = Array.from(allowReadTodolist
                    .concat(allowReadTodolist, allowWriteTodolist)
                    .reduce((m, t) => m.set(t.name, t), new Map()).values());
            });
        } catch (e) {
            console.log('error : ', e);
        }
    }

    /**
     * return an observable of todolist
     * data are parsed using convertsnapshot
     *
     * @param query : firestoreCollection reference
     */
    convertQuery(query: AngularFirestoreCollection<Todolist>): Observable<Array<Todolist>> {
        // this.refSubscriptionAllSnapshots.push(query.snapshotChanges());
        let res: Observable<Array<Todolist>> = query.snapshotChanges().pipe(
            map(this.convertSnapshots), // data of each todolist
            map((allTodolistDatas: Todolist[]) => allTodolistDatas.map(allTodolistDatas => query.doc(allTodolistDatas.id).collection<Todo>('item').snapshotChanges().pipe( // rename parameter to todolistDatas ?
                map(this.convertSnapshots),
                map((allTodosDatas: Array<Todo>) => Object.assign(allTodolistDatas, {['todos']: allTodosDatas})
                )
                ))
            ),
            flatMap(combined => combineLatest(combined))
        );
        return res;
    }

    /**
     * a generic method used to parse generics datas from angularFSC snapshot
     *
     * @param snap : datas from angular FirestoreCollection
     */
    convertSnapshots<T>(snaps) {
        return <T[]>snaps.map(snap => {
            console.log("conversnapshot, id ", snap.payload.doc.data());
            return {
                id: snap.payload.doc.id,
                ...snap.payload.doc.data()
            };
        });
    }

    /**
     * return todolist based on id
     */
    getTodolist(id: string): Observable<Todolist> {

        const query = this.db.collection<Todolist>('list', ref =>
            ref.where(firebase.firestore.FieldPath.documentId(), '==', id));
        const res = this.convertQuery(query).pipe(
            map(todolists => todolists.find(todolist => todolist.id === id)));
        return res;

    }

    /**
     * return observable of the 3 arrays (owner, allowR, allowR)
     */
    get(): Observable<Array<Array<Todolist>>> {
        console.log("get mergetodolist : ", this.mergedTodolists);
        return this.mergedTodolists;
    }

    /**
     * used for unsubscribe when logged out
     */
    getRefSubscriptionMergedTodolist(): Subscription {
        return this.refSubscriptionMergedTodolist;
    }

    /**
     * Used for getting data when component is loaded, will be overrided once observable triggered
     */
    getLatestOwnerTodolist(): Array<Todolist> {
        return this.initLatestOwnerTodolist;
    }

    /**
     * same here for shared list
     */
    getLatestReadWriteTodolist(): Array<Todolist> {
        return this.initLatestReadWriteTodolist;
    }

    addTodolist(todolist: Todolist) {
        return this.todolistsCollection.add(todolist);
    }

    addTodo(todo: Todo, todolistID: string) {
        return this.todolistsCollection.doc(todolistID).collection('item').add(todo);
    }

    updateTodo(todo: Todo, todoID: string, todolistID: string) {
        this.todolistsCollection.doc(todolistID).collection('item').doc(todoID).update(todo);
    }

    deleteTodolist(todolist: Todolist) {
        return this.todolistsCollection.doc(todolist.id).delete();
    }

    deleteTodo(todo: Todo, todolistID: string) {
        return this.todolistsCollection.doc(todolistID).collection('item').doc(todo.id).delete();
    }

}

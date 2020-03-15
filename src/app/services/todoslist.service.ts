import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {combineLatest,  Observable, pipe, ObservedValueOf} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Todolist} from "../model/todolist";
import {Todo} from "../model/todo";
import {toTitleCase} from "codelyzer/util/utils";
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class TodoslistService {
    private todolistsCollection: AngularFirestoreCollection<Todolist>;
    private ownerQuery: AngularFirestoreCollection<Todolist>;
    private allowReadQuery: AngularFirestoreCollection<Todolist>;
    private allowWriteQuery: AngularFirestoreCollection<Todolist>;
    private todolistsQueries: Array<AngularFirestoreCollection<Todolist>>;
    private todolists: Array<Observable<Array<Todolist>>>; // TODO peut etre supprimer ou ajouter array
    private mergedTodolists : Observable<Array<Array<Todolist>>>; // TODO Observable<Array<Todolist>>;
    private items: Array<Todo>;
    private allowRead: Array<Todo>;
    private allowWrite: Array<Todo>;

    constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
        const user = afAuth.auth.currentUser;
        console.log('user : ' + user);
        console.log('user.displayName' + user.displayName);
        console.log('user.email' + user.email);
        console.log('user.uid' + user.uid);
        console.log('user.photoURL' + user.photoURL);

        /** TODO
         if (user) {
            // User is signed in.
        } else {
            // No user is signed in.
        }
         */


        /**
         this.todolists = combineLatest(ownerRef.valueChanges(), allowReadRef.valueChanges(),allowWriteRef.valueChanges())

         );.pipe(
         switchMap(filteredList => {
            const [ownerLists, allowReadLists , allowWriteLists] = filteredList;
            const combined = ownerLists.concat(allowReadLists,allowWriteLists);
            console.log('filtered : ' + JSON.stringify(filteredList));
            console.log('ownerLists : ' + JSON.stringify(ownerLists));
            console.log('allowReadLists : ' + JSON.stringify(allowReadLists));
            console.log('allowWriteLists : ' + JSON.stringify(allowWriteLists));
            console.log('combined : ' + JSON.stringify(combined));
            return of(combined);
        })
         this.todolists.subscribe(value =>
         console.log('value : ' + JSON.stringify(value))
         )
         */
        /**
         // return all list (Array of Observable Todolist containing Array of todo)
         // TODO implements shared lists
         // Load collection containing all todolist document

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
         */
        /**
         this.todolistsCollection = [ownerRef,allowReadRef,allowWriteRef];
         this.todolists = combineLatest(this.todolistsCollection.map(query => this.convertQuery(query)));
         */

        this.todolistsCollection = db.collection<Todolist>('list', ref =>
            ref.where('owner', '==', user.email)
                .where("allowRead", "array-contains", user.uid));

        this.ownerQuery = db.collection<Todolist>('list', ref =>
            ref.where('owner', '==', user.email));
        this.allowReadQuery = db.collection<Todolist>('list', ref =>
            ref.where("allowRead", "array-contains", user.uid));
        this.allowWriteQuery = db.collection<Todolist>('list', ref =>
            ref.where("allowWrite", "array-contains", user.uid));

        this.todolistsQueries = [
            this.ownerQuery,
            this.allowReadQuery,
            this.allowWriteQuery
        ];

        this.todolists = this.todolistsQueries.map((query => { // TODO add combine latest
            console.log('traitement de la query : ' + query);
            const res = this.convertQuery(query);
            return res;
        }));

        this.todolists.map((todolist) => {
            todolist.subscribe(todolist => {
                console.log('todolist : ', JSON.stringify(todolist));
            })
        });


        const firstTodolist = this.todolists[0];
        const secondTodolist = this.todolists[1];
        const thirdTodolist = this.todolists[2];

        firstTodolist.subscribe(todolist => {
            console.log('firstTodolist (owner): ', JSON.stringify(todolist));
        });

        secondTodolist.subscribe(todolist => {
            console.log('secondTodolist (read): ', JSON.stringify(todolist));
        });

        thirdTodolist.subscribe(todolist => {
            console.log('thirdTodolist (write): ', JSON.stringify(todolist));
        });

        this.mergedTodolists = combineLatest(this.todolists);
        this.mergedTodolists.subscribe(value => console.log('mergetodolist: ' + JSON.stringify(value)));


        /**

         this.mergedTodolists = combineLatest(firstTodolist, secondTodolist,thirdTodolist)
         );.pipe(
         switchMap(filteredList => {
                const [ownerLists, allowReadLists , allowWriteLists] = filteredList;
                const combined = ownerLists.concat(allowReadLists,allowWriteLists);
                console.log('filtered : ' + JSON.stringify(filteredList));
                console.log('ownerLists : ' + JSON.stringify(ownerLists));
                console.log('allowReadLists : ' + JSON.stringify(allowReadLists));
                console.log('allowWriteLists : ' + JSON.stringify(allowWriteLists));
                console.log('combined : ' + JSON.stringify(combined));
                return of(combined);
            })



         this.mergedTodolists.subscribe(todolist => {
console.log('todolist : ', JSON.stringify(todolist));

})
         */        /**
         let combined = emptyList.concat(filteredList);
         console.log('filtered : ' + JSON.stringify(filteredList));
         console.log('ownerLists : ' + JSON.stringify(ownerLists));
         console.log('allowReadLists : ' + JSON.stringify(allowReadLists));
         console.log('allowWriteLists : ' + JSON.stringify(allowWriteLists));
         console.log('combined : ' + JSON.stringify(combined));
         return of(combined);
         );
         */
    }

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

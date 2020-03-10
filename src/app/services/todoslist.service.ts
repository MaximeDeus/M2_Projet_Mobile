import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {combineLatest,  of,Observable} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {Todolist} from "../model/todolist";
import {Todo} from "../model/todo";
import {toTitleCase} from "codelyzer/util/utils";
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class TodoslistService {

    private todolistsCollection: AngularFirestoreCollection<Todolist>;
    private todolists: Observable<Array<Todolist>>;
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

const ownerRef = db.collection<Todolist>('list',ref =>
    ref.where('owner', '==', user.email));
const allowReadRef = db.collection<Todolist>('list',ref =>
    ref.where("allowRead", "array-contains", user.uid));
const allowWriteRef = db.collection<Todolist>('list',ref =>
    ref.where("allowWrite", "array-contains", user.uid));

this.todolists = combineLatest(ownerRef.valueChanges(), allowReadRef.valueChanges(),allowWriteRef.valueChanges())
    .pipe(
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
    );
this.todolists.subscribe(value =>
    console.log('value : ' + JSON.stringify(value))
)

        // return all list (Array of Observable Todolist containing Array of todo)
        // TODO implements shared lists
        // Load collection containing all todolist document
        this.todolistsCollection = db.collection<Todolist>('list',ref =>
            ref.where('owner', '==', user.email)
               .where("allowRead", "array-contains", user.uid));
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

import {Todo} from "./todo";

export interface Todolist {
    todos : Array<Todo>;
    id?: string;
    name : string;
    owner : string;
}

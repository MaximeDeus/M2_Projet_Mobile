import {Todo} from "./todo";

export interface Todolist {
    todos : Array<Todo>;
    allowRead : Array<string>;
    allowWrite : Array<string>;
    id?: string;
    name : string;
    owner : string;
}

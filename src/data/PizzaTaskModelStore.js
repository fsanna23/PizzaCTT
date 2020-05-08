import TaskModelStore from "./TaskModelStore";
import { makeOrder } from "../tasks/jsonTree";
import jsonLinks from "../tasks/jsonLinks";

let pizzaTaskStore = new TaskModelStore(makeOrder, jsonLinks);

export { pizzaTaskStore };

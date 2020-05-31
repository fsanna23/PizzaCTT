import TaskModelStore from "./TaskModelStore";
import { makeOrder } from "../tasks/jsonTree";
import ActionTypes from "../data/ActionTypes";

/*   This map is needed to associate one ActionType to one or more
 *   GroundTerms of the task model. To create this, you'll need to
 *   import the ActionTypes from your Flux structure and you'll
 *   have to write yourself the name of the GroundTerms IDs. */
let mapLinks = new Map();
mapLinks.set(ActionTypes.CHANGE_PIZZA_TYPE, "selectpizza");
mapLinks.set(ActionTypes.CHANGE_TOPPINGS, "addtopping");
mapLinks.set(ActionTypes.CHANGE_NUMBER, "specifyorderamount");

/* The "_subroots" association has to be made if you're not going to
 *  pass the handlersEventMap to the TaskModelStore; adding this
 *  association, you ensure that the subroots too will have a
 *  completion handler, so that you can be notified when they've
 *  been finished. */
mapLinks.set("_subroots", ["addtobasket", "managebasket"]);

let handlersEventMap = new Map();
handlersEventMap.set("selectpizza", function(evt) {
  console.log("You have completed the task " + evt.term.id);
});

let pizzaTaskStore = new TaskModelStore(makeOrder, mapLinks, handlersEventMap);

export { pizzaTaskStore };

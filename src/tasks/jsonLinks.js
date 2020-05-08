import ActionTypes from "../data/ActionTypes";

/*   This map is needed to associate one ActionType to one or more
 *   GroundTerms of the task model. To create this, you'll need to
 *   import the ActionTypes from your Flux structure and you'll
 *   have to write yourself the name of the GroundTerms IDs. */
let mapLinks = new Map();
mapLinks.set(ActionTypes.CHANGE_PIZZA_TYPE, "selectpizza");
mapLinks.set(ActionTypes.CHANGE_TOPPINGS, "addtopping");
mapLinks.set(ActionTypes.CHANGE_NUMBER, "specifyorderamount");

export default mapLinks;

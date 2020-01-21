import Immutable from "immutable";
import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";

class MainStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.CREATE_NEW_ORDER:
        console.log("Creating order");
        return state.set("orderCreating", true);
      case ActionTypes.CANCEL_ORDER:
        return state.set("orderCreating", false);
      default:
        return state;
    }
  }
}

export default new MainStore();

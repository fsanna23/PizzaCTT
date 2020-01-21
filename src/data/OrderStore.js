import Immutable from "immutable";
import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";

class OrderStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.List();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.ADD_ORDER_TO_BASKET:
        console.log("Adding to basket");
        return state.push(action.order);
      default:
        return state;
    }
  }
}

export default new OrderStore();

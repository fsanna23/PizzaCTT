import Immutable from "immutable";
import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";
import Counter from "./Counter";
import Pizza from "./Pizza";

class OrderStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.CREATE_NEW_ORDER:
        return state;
      default:
        return state;
    }
  }
}

export default new OrderStore();

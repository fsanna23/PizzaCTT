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
    return Immutable.List();
  }

  shiftOtherNumbers(order) {
    let currentNumber = order.get("id").slice(3);
    return order.set(
      "id",
      order.get("id").slice(0, -1) + String(parseInt(currentNumber) - 1)
    );
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.ADD_ORDER_TO_BASKET:
        return state.push(new Pizza(action.order));
      case ActionTypes.REMOVE_ORDER_FROM_BASKET:
        Counter.decrementWithoutReturning();
        // TODO add update of other indices in order
        return state.delete(action.index);
      default:
        return state;
    }
  }
}

export default new OrderStore();

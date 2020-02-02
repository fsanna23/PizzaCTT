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
        const newOrder = Pizza(action.order.toJS());
        return state.push(newOrder);
      case ActionTypes.REMOVE_ORDER_FROM_BASKET:
        Counter.decrementWithoutReturning();
        return state.delete(action.index).map((order, index) => {
          if (index >= action.index) {
            return this.shiftOtherNumbers(order);
          }
          return order;
        });
      case ActionTypes.INCREASE_ORDER:
        return state.map((order, index) => {
          if (index === action.index) {
            let oldNumber = order.get("number");
            let newNumber = oldNumber + 1;
            return order
              .update("number", number => newNumber)
              .update(
                "totalCost",
                totalCost => (totalCost / oldNumber) * newNumber
              );
          }
          return order;
        });
      case ActionTypes.DECREASE_ORDER:
        return state.map((order, index) => {
          if (index === action.index) {
            let oldNumber = order.get("number");
            let newNumber = oldNumber - 1;
            return order
              .update("number", number => newNumber)
              .update(
                "totalCost",
                totalCost => (totalCost / oldNumber) * newNumber
              );
          }
          return order;
        });
      default:
        return state;
    }
  }
}

export default new OrderStore();

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
        const id = Counter.increment();
        return state.set(
          id,
          new Pizza({
            pizzaType: "",
            pizzaToppings: {
              Mushrooms: false,
              Olives: false,
              Bacon: false,
              Pepperoni: false,
              Onions: false,
              "Green Peppers": false
            },
            number: 1
          })
        );
      case ActionTypes.CHANGE_PIZZA_TYPE:
        if (action.text === "")
          return state.update(Counter.getPreviousValue(), pizza =>
            pizza.set("pizzaType", " ")
          );
        console.log(Counter.getValue());
        return state.update(Counter.getPreviousValue(), pizza =>
          pizza.set("pizzaType", action.text)
        );
      case ActionTypes.CHANGE_TOPPINGS:
        return state.update(Counter.getPreviousValue(), pizza =>
          pizza.update("pizzaToppings", toppings =>
            toppings.set(action.text, !toppings[action.text])
          )
        );
      case ActionTypes.CHANGE_NUMBER:
        return state.update(Counter.getPreviousValue(), pizza =>
          pizza.set("number", action.number)
        );
      case ActionTypes.CANCEL_ORDER:
        return state.clear();
      default:
        return state;
    }
  }
}

export default new OrderStore();

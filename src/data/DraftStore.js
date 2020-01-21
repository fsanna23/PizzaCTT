import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";
import Counter from "./Counter";
import Pizza from "./Pizza";

class DraftStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Pizza();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.CREATE_NEW_ORDER:
        const id = Counter.increment();
        return state.merge({
          id,
          pizzaType: " ",
          pizzaToppings: {
            Mushrooms: false,
            Olives: false,
            Bacon: false,
            Pepperoni: false,
            Onions: false,
            "Green Peppers": false
          },
          number: 1
        });
      case ActionTypes.CHANGE_PIZZA_TYPE:
        if (action.text === "") return state.set("pizzaType", " ");
        return state.set("pizzaType", action.text);
      case ActionTypes.CHANGE_TOPPINGS:
        return state.set(
          "pizzaToppings",
          Object.fromEntries(
            Object.entries(state.get("pizzaToppings")).map(([k, v]) =>
              k === action.text ? [k, !v] : [k, v]
            )
          )
        );
      case ActionTypes.CHANGE_NUMBER:
        return state.set("number", action.number);
      case ActionTypes.CANCEL_ORDER:
        return state.clear();
      default:
        return state;
    }
  }
}

export default new DraftStore();

import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";
import Counter from "./Counter";
import Pizza from "./Pizza";

class DraftStore extends ReduceStore {
  pizzaTypeCosts = [
    {
      type: "Tomato sauce and cheese",
      cost: 2.5
    },
    {
      type: "Tomato sauce, no cheese",
      cost: 2.0
    },
    {
      type: "Cheese, no tomato sauce",
      cost: 2.0
    },
    {
      type: "No tomato sauce, no cheese",
      cost: 1.5
    }
  ];

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Pizza();
  }

  setNewCost(obj) {
    let totalCost = 0;
    let state = obj.state;
    switch (obj.type) {
      /**
       * If we changed the type, we have to update the totalCost
       * with the new type cost.
       */
      case "type":
        this.pizzaTypeCosts.forEach(type => {
          if (obj.value === type.type) {
            totalCost += type.cost;
          }
        });
        state.get("pizzaToppings").forEach(topping => {
          if (topping.state) {
            totalCost += topping.cost;
          }
        });
        return totalCost * state.get("number");
      /**
       * If we changed the toppings, the value we are passing is the one
       * that has been changed. This means that if the topping wasn't
       * selected we have to add its cost to the totalCost, if it was
       * already selected we don't add it (because now it's been
       * checked as unselected).
       */
      case "toppings":
        this.pizzaTypeCosts.forEach(type => {
          if (state.get("pizzaType") === type.type) {
            totalCost += type.cost;
          }
        });
        state.get("pizzaToppings").forEach(topping => {
          if (topping.state) {
            totalCost += topping.cost;
          }
        });
        return totalCost * state.get("number");
      case "number":
        this.pizzaTypeCosts.forEach(type => {
          if (state.get("pizzaType") === type.type) {
            totalCost += type.cost;
          }
        });
        state.get("pizzaToppings").forEach(topping => {
          if (topping.state) {
            totalCost += topping.cost;
          }
        });
        return totalCost * obj.value;
      default:
        return undefined;
    }
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.CREATE_NEW_ORDER:
        const id = Counter.increment();
        return state.set("id", id).set("pizzaType", " ");
      case ActionTypes.CHANGE_PIZZA_TYPE:
        if (action.text === "") return state.set("pizzaType", " ");
        return state.set("pizzaType", action.text).update("totalCost", cost =>
          this.setNewCost({
            type: "type",
            value: action.text,
            state: state
          })
        );
      case ActionTypes.CHANGE_TOPPINGS:
        return state
          .update("pizzaToppings", toppings => {
            toppings.forEach(topping => {
              topping.state =
                topping.name === action.text ? !topping.state : topping.state;
            });
          })
          .update("totalCost", cost =>
            this.setNewCost({
              type: "toppings",
              value: action.text,
              state: state
            })
          );
      case ActionTypes.CHANGE_NUMBER:
        return state.set("number", action.number).update("totalCost", cost =>
          this.setNewCost({
            type: "number",
            value: action.number,
            state: state
          })
        );
      case ActionTypes.CANCEL_ORDER:
        return state.clear();
      case ActionTypes.CLEAR_DRAFT:
        return state.clear().update("pizzaToppings", toppings => {
          return toppings.map(topping =>
            Object.assign(topping, { state: false })
          );
        });
      default:
        return state;
    }
  }
}

export default new DraftStore();

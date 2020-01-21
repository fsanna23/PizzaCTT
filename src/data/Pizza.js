import Immutable from "immutable";

const Pizza = Immutable.Record({
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
});

export default Pizza;

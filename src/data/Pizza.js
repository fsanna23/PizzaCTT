import Immutable from "immutable";

const Pizza = Immutable.Record({
  id: "id-null", //You should always put a new ID
  pizzaType: "",
  pizzaToppings: [
    { name: "Mushrooms", state: false, cost: 2 },
    { name: "Olives", state: false, cost: 1 },
    { name: "Bacon", state: false, cost: 2 },
    { name: "Pepperoni", state: false, cost: 1 },
    { name: "Onions", state: false, cost: 1 },
    { name: "Green Peppers", state: false, cost: 2 }
  ],
  number: 1,
  totalCost: 0
});

export default Pizza;

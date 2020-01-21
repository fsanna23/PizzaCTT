import Dispatcher from "./Dispatcher";
import ActionTypes from "./ActionTypes";

const Actions = {
  createNewOrder() {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_NEW_ORDER
    });
  },
  cancelOrder() {
    Dispatcher.dispatch({
      type: ActionTypes.CANCEL_ORDER
    });
  },
  changePizzaType(text) {
    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_PIZZA_TYPE,
      text
    });
  },
  changeToppings(text) {
    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_TOPPINGS,
      text
    });
  },
  changeNumber(number) {
    Dispatcher.dispatch({
      type: ActionTypes.CHANGE_NUMBER,
      number
    });
  }
};

export default Actions;

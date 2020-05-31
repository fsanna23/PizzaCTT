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
  },
  addOrderToBasket(order) {
    Dispatcher.dispatch({
      type: ActionTypes.ADD_ORDER_TO_BASKET,
      order
    });
  },
  clearDraft() {
    Dispatcher.dispatch({
      type: ActionTypes.CLEAR_DRAFT
    });
  },
  openBasketModal() {
    Dispatcher.dispatch({
      type: ActionTypes.OPEN_BASKET_MODAL
    });
  },
  closeBasketModal() {
    Dispatcher.dispatch({
      type: ActionTypes.CLOSE_BASKET_MODAL
    });
  },
  removeOrderFromBasket(index) {
    Dispatcher.dispatch({
      type: ActionTypes.REMOVE_ORDER_FROM_BASKET,
      index
    });
  },
  increaseOrder(index) {
    Dispatcher.dispatch({
      type: ActionTypes.INCREASE_ORDER,
      index
    });
  },
  decreaseOrder(index) {
    Dispatcher.dispatch({
      type: ActionTypes.DECREASE_ORDER,
      index
    });
  },
  openPaymentModal() {
    Dispatcher.dispatch({
      type: ActionTypes.OPEN_PAYMENT_MODAL
    });
  },
  closePaymentModal() {
    Dispatcher.dispatch({
      type: ActionTypes.CLOSE_PAYMENT_MODAL
    });
  },
  editPaymentName() {
    Dispatcher.dispatch({
      type: ActionTypes.EDIT_PAYMENT_NAME
    });
  },
  editPaymentAddress() {
    Dispatcher.dispatch({
      type: ActionTypes.EDIT_PAYMENT_ADDRESS
    });
  }
};

export default Actions;

import AppView from "../views/AppView";
import { Container } from "flux/utils";
import MainStore from "../data/MainStore";
import OrderStore from "../data/OrderStore";
import Actions from "../data/MainActions";

function getStores() {
  return [MainStore, OrderStore];
}

function getState() {
  return {
    mainState: MainStore.getState(),
    order: OrderStore.getState(),
    onChangePizzaType: Actions.changePizzaType,
    onCreateNewOrder: Actions.createNewOrder,
    onCancelOrder: Actions.cancelOrder,
    onChangeToppings: Actions.changeToppings,
    onChangeNumber: Actions.changeNumber
  };
}

export default Container.createFunctional(AppView, getStores, getState);

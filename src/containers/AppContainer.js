import AppView from "../views/AppView";
import { Container } from "flux/utils";
import MainStore from "../data/MainStore";
import OrderStore from "../data/OrderStore";
import Actions from "../data/MainActions";
import DraftStore from "../data/DraftStore";

function getStores() {
  return [MainStore, OrderStore, DraftStore];
}

function getState() {
  return {
    mainState: MainStore.getState(),
    order: OrderStore.getState(),
    draft: DraftStore.getState(),
    onChangePizzaType: Actions.changePizzaType,
    onCreateNewOrder: Actions.createNewOrder,
    onCancelOrder: Actions.cancelOrder,
    onChangeToppings: Actions.changeToppings,
    onChangeNumber: Actions.changeNumber,
    onAddOrderToBasket: Actions.addOrderToBasket,
    onClearDraft: Actions.clearDraft,
    onOpenBasketModal: Actions.openBasketModal,
    onCloseBasketModal: Actions.closeBasketModal,
    onRemoveOrderFromBasket: Actions.removeOrderFromBasket,
    onIncreaseOrder: Actions.increaseOrder,
    onDecreaseOrder: Actions.decreaseOrder
  };
}

export default Container.createFunctional(AppView, getStores, getState);

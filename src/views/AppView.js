import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";

function AppView(props) {
  // console.log("The order is: ", props.order);
  // console.log("The draft is: ", props.draft);
  let isOrderCreating = [];
  if (props.draft.get("id") !== "id-null") {
    isOrderCreating.push(<PizzaTypeForm {...props} />);
    isOrderCreating.push(<Footer {...props} />);
    if (props.draft.get("pizzaType") !== " ") {
      isOrderCreating.push(<PizzaNumber {...props} />);
    }
  }

  return (
    <div className="container mt-3">
      <NavBar {...props} />
      {isOrderCreating[0]}
      {isOrderCreating[2]}
      {isOrderCreating[1]}
      <BasketModal {...props} />
    </div>
  );
}

function NavBar(props) {
  let basketSize = "";
  if (props.order.size === 0) {
    basketSize = "Basket (Empty)";
  } else {
    basketSize = "Basket (" + props.order.size + " items)";
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href=".">
        <img
          src="https://f0.pngfuel.com/png/910/489/pizza-logo-png-clip-art.png"
          width="65"
          height="65"
        />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href=".">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item active">
            <a
              className="nav-link"
              href="#"
              onClick={e => {
                e.preventDefault();
                return props.draft.get("id") === "id-null"
                  ? props.onCreateNewOrder()
                  : null;
              }}
            >
              Create new order
            </a>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <button
            className="btn btn-outline-dark my-2 my-sm-0"
            onClick={e => {
              e.preventDefault();
              props.onOpenBasketModal();
            }}
          >
            {basketSize}
          </button>
        </form>
      </div>
    </nav>
  );
}

function PizzaTypeForm(props) {
  const types = [
    " ",
    "Tomato sauce and cheese ($2.50)",
    "Tomato sauce, no cheese ($2.00)",
    "Cheese, no tomato sauce ($2.00)",
    "No tomato sauce, no cheese ($1.50)"
  ];
  let typeSelected =
    props.draft.get("pizzaType") !== " " ? (
      <PizzaToppingForm {...props} />
    ) : (
      " "
    );
  return (
    <div className="container mt-3">
      <form>
        <div className="form-group">
          <label htmlFor="pizzatype">Choose your pizza type:</label>
          <select
            className="form-control"
            id="pizzatype"
            onChange={e => {
              props.onChangePizzaType(e.target.value.slice(0, -8));
            }}
          >
            {types.map(type => {
              return <option key={type}>{type}</option>;
            })}
          </select>
        </div>
      </form>
      {typeSelected}
    </div>
  );
}

function PizzaToppingForm(props) {
  const toppings = [
    "Mushrooms ($2.00)",
    "Olives ($1.00)",
    "Bacon ($2.00)",
    "Pepperoni ($1.00)",
    "Onions ($1.00)",
    "Green Peppers ($2.00)"
  ];
  return (
    <div className="mt-3 fadeIn">
      <p>Choose your toppings:</p>
      <form>
        {}
        <div className="form-row">
          {toppings.slice(0, 3).map(topping => {
            return (
              <div className="form-group col-md-3" key={topping + "maindivkey"}>
                <div className="form-check">
                  <input
                    className="form-check-input pizzatopping"
                    type="checkbox"
                    value=""
                    id={topping + "id"}
                    onChange={() =>
                      props.onChangeToppings(topping.slice(0, -8))
                    }
                  />
                  <label className="form-check-label" htmlFor={topping + "id"}>
                    {topping}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="form-row">
          {toppings.slice(3, 6).map(topping => {
            return (
              <div className="form-group col-md-3" key={topping + "maindivkey"}>
                <div className="form-check">
                  <input
                    className="form-check-input pizzatopping"
                    type="checkbox"
                    value=""
                    id={topping + "id"}
                    onChange={() =>
                      props.onChangeToppings(topping.slice(0, -8))
                    }
                  />
                  <label className="form-check-label" htmlFor={topping + "id"}>
                    {topping}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}

function PizzaNumber(props) {
  return (
    <div className="container mt-2">
      <p>How many of these do you want?</p>
      <div className="input-group">
        <input
          className="form-control"
          type="number"
          defaultValue="1"
          min="1"
          max="20"
          id="pizzanumber"
          onChange={e => {
            props.onChangeNumber(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function Footer(props) {
  function triggerAlert() {
    Swal.fire({
      title: "Done!",
      html: "Your order has been added into the basket!",
      timer: 1550,
      icon: "success",
      showConfirmButton: false
    });
  }

  let typeSelected =
    props.draft.get("pizzaType") !== " " ? (
      <button
        className="btn btn-primary float-right ml-2 mr-4"
        onClick={e => {
          e.preventDefault();
          props.onAddOrderToBasket(props.draft);
          props.onClearDraft();
          triggerAlert();
        }}
      >
        Add order
      </button>
    ) : (
      " "
    );
  let price =
    props.draft.get("pizzaType") !== " " ? (
      <h4 className="float-left mb-3 pl-4">
        Total cost: {props.draft.get("totalCost")}
      </h4>
    ) : (
      " "
    );
  return (
    <div className="mt-3">
      {price}
      {typeSelected}
      <button
        className="btn btn-danger float-right"
        onClick={props.onCancelOrder}
      >
        Cancel order
      </button>
    </div>
  );
}

function BasketModal(props) {
  return (
    <div>
      <Modal
        show={props.mainState.get("modalShow")}
        onHide={props.onCloseBasketModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Your basket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.order.isEmpty() ? (
            <p className="text-center">Your basket is empty</p>
          ) : (
            props.order.map((pizza, index) => {
              return (
                <div className="card" key={pizza.id + "-card"}>
                  <div className="card-body">
                    <div className="row">
                      <h5 className="card-title col-sm-6">
                        {"Pizza " + pizza.id.slice(3)}
                      </h5>
                      <div className="card-title col-sm-6 float-right">
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            props.onRemoveOrderFromBasket(index);
                          }}
                        >
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:
                        ANd9GcQLCghb2UYalXD3YpeUMQXYWM0ZknNEzzJYiu3nqgcTJEIF4INYag&s"
                            className="float-right flex-column"
                            alt="remove-icon"
                            height="28px"
                          />
                        </a>
                      </div>
                    </div>
                    <p className="card-text">
                      <strong>Pizza Type: </strong>
                      {pizza.pizzaType}
                    </p>
                    <p className="card-text mb-sm-0">
                      <strong>Pizza Toppings: </strong>
                    </p>
                    <ul>
                      {pizza.pizzaToppings
                        .filter(topping => {
                          return topping.state;
                        })
                        .map(topping => {
                          return (
                            <li key={pizza.id + "-topping-" + topping.name}>
                              {topping.name}
                            </li>
                          );
                        })}
                    </ul>
                    <p className="card-text">
                      <strong>Number of pizzas: </strong>
                      <a
                        href="#"
                        className="mr-1 ml-1"
                        onClick={e => {
                          e.preventDefault();
                          if (pizza.number !== 1) props.onDecreaseOrder(index);
                        }}
                      >
                        <img
                          src="https://cdn.onlinewebfonts.com/svg/img_80473.png"
                          width="17px"
                          height="17px"
                        />
                      </a>
                      {pizza.number}
                      <a
                        href="#"
                        className="mr-1 ml-1"
                        onClick={e => {
                          e.preventDefault();
                          if (pizza.number !== 20) props.onIncreaseOrder(index);
                        }}
                      >
                        <img
                          src="http://cdn.onlinewebfonts.com/svg/img_45824.png"
                          width="17px"
                          height="17px"
                        />
                      </a>
                    </p>
                    <p className="card-text">
                      <strong>Total cost: </strong>
                      {pizza.totalCost}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCloseBasketModal}>
            Close
          </Button>
          <Button variant="primary" onClick={props.onCloseBasketModal}>
            Go to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AppView;

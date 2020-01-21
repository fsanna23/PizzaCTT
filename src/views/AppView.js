import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function AppView(props) {
  console.log(props.draft);
  let isOrderCreating = [];
  if (props.draft.get("id") !== "id-null") {
    console.log("Yes yes yes");
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
      <MyModal />
    </div>
  );
}

function NavBar(props) {
  /**
   * TODO: number of items
   * Add number of items that are actually in the basket
   */
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
              onClick={() => props.onCreateNewOrder()}
            >
              Create new order
            </a>
          </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <button className="btn btn-outline-dark my-2 my-sm-0" type="submit">
            Basket
          </button>
        </form>
      </div>
    </nav>
  );
}

function PizzaTypeForm(props) {
  const types = [
    " ",
    "Tomato sauce and cheese",
    "Tomato sauce, no cheese",
    "Cheese, no tomato sauce",
    "No tomato sauce, no cheese"
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
              props.onChangePizzaType(e.target.value);
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
    "Mushrooms",
    "Olives",
    "Bacon",
    "Pepperoni",
    "Onions",
    "Green Peppers"
  ];
  return (
    <div className="mt-3 fadeIn">
      <p>Choose your toppings:</p>
      <form>
        {}
        <div className="form-row">
          {toppings.slice(0, 3).map(topping => {
            return (
              <div className="form-group col-md-2" key={topping + "maindivkey"}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={topping + "id"}
                    onChange={() => props.onChangeToppings(topping)}
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
              <div className="form-group col-md-2" key={topping + "maindivkey"}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={topping + "id"}
                    onChange={() => props.onChangeToppings(topping)}
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
  let typeSelected =
    props.draft.get("pizzaType") !== " " ? (
      <button className="btn btn-primary float-right ml-2">Add order</button>
    ) : (
      " "
    );
  return (
    <div className="mt-3">
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

function MyModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AppView;

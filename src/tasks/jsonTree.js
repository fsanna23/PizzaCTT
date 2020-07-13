let addToBasket = {
  sequence: [
    { gt: "webtask", tid: "selectpizza" },
    {
      anyOrder: [
        { gt: "webtask", tid: "addtopping", iterative: true },
        { gt: "webtask", tid: "specifyorderamount", iterative: true }
      ]
    }
  ],
  tid: "addtobasket"
};

let manageBasket = {
  anyOrder: [
    { gt: "webtask", tid: "deletepizza", iterative: true },
    { gt: "webtask", tid: "changeamount", iterative: true }
  ],
  tid: "managebasket"
};

let enterOrderDetails = {
  parallel: [
    { gt: "webtask", tid: "enteraddress" },
    { gt: "webtask", tid: "entername" }
  ],
  tid: "enterorderdetails"
};

/*  makeOrder must be the input of the sensor */
let makeOrder = {
  sequence: [
    { ...addToBasket },
    // {
    //   disabling: [{ ...manageBasket }, { ...enterOrderDetails }]
    // }
    /* There's no operator for the optional task manageBasket */
    { ...enterOrderDetails }
  ],
  tid: "makeorder"
};

export { makeOrder };

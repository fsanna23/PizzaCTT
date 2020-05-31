let addToBasket = {
  sequence: [
    { gt: "const.myconst", tid: "selectpizza" },
    {
      anyOrder: [
        { gt: "const.myconst", tid: "addtopping", iterative: true },
        { gt: "const.myconst", tid: "specifyorderamount", iterative: true }
      ]
    }
  ],
  tid: "addtobasket"
};

let manageBasket = {
  anyOrder: [
    { gt: "const.myconst", tid: "deletepizza", iterative: true },
    { gt: "const.myconst", tid: "changeamount", iterative: true }
  ],
  tid: "managebasket"
};

let enterOrderDetails = {
  parallel: [
    { gt: "const.myconst", tid: "enteraddress" },
    { gt: "const.myconst", tid: "entername" }
  ],
  tid: "enterorderdetails"
};

/*  makeOrder must be the input of the sensor */
let makeOrder = {
  sequence: [
    { ...addToBasket },
    {
      disabling: [{ ...manageBasket }, { ...enterOrderDetails }]
    }
  ],
  tid: "makeorder"
};

export { makeOrder };

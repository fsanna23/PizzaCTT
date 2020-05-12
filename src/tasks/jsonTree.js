let addToBasket = {
  sequence: [
    { gt: "const.myconst", tid: "selectpizza" },
    { gt: "const.myconst", tid: "addtopping" },
    { gt: "const.myconst", tid: "specifyorderamount" }
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

let confirmOrder = {
  sequence: [
    { ...enterOrderDetails },
    {
      disabling: [
        { gt: "const.myconst", tid: "payorder" },
        { gt: "const.myconst", tid: "validatepayment" }
      ]
    }
  ],
  tid: "confirmorder"
};

/*  makeOrder must be the input of the sensor */
let makeOrder = {
  sequence: [
    { ...addToBasket },
    {
      parallel: [
        { ...manageBasket },
        {
          disabling: [
            { gt: "const.myconst", tid: "displayorderprice" },
            { ...confirmOrder }
          ]
        }
      ]
    },
    { gt: "const.myconst", tid: "processorder" }
  ],
  tid: "makeorder"
};

export { makeOrder };

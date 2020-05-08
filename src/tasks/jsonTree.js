let addToBasket = {
  sequence: [
    { gt: "const.myconst", tid: "selectpizza" },
    { gt: "const.myconst", tid: "addtopping" },
    { gt: "const.myconst", tid: "specifyorderamount" }
  ],
  iterative: true
};

let manageBasket = {
  anyOrder: [
    { gt: "const.myconst", tid: "deletepizza", iterative: true },
    { gt: "const.myconst", tid: "changeamount", iterative: true }
  ]
};

let enterOrderDetails = {
  parallel: [
    { gt: "const.myconst", tid: "enteraddress" },
    { gt: "const.myconst", tid: "entername" }
  ]
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
  ]
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
  ]
};

export { makeOrder };

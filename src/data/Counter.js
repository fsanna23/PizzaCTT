let _counter = 1;

const Counter = {
  increment() {
    return "id-" + String(_counter++);
  },
  getValue() {
    return "id-" + String(_counter);
  },
  getPreviousValue() {
    return "id-" + String(_counter - 1);
  }
};

export default Counter;

import Djestit from "./djestit-node";

class DjestitGeneric extends Djestit {
  constructor() {
    super();

    let _MYCONST = 1;
    let self = this;

    let MyConstToken = function(type, id) {
      this.type = type;
      this.id = id;
    };
    MyConstToken.prototype = new this.Token();
    self.MyConstToken = MyConstToken;

    let MyConst = function(id) {
      this.init();
      this.id = id;

      this._accepts = function(token) {
        return token.type === _MYCONST && token.id === this.id;
      };
    };
    MyConst.prototype = new this.GroundTerm();
    self.MyConst = MyConst;

    this.myConstExpression = function(json) {
      if (json.gt) {
        return new self.MyConst(json.tid);
      }
    };

    this.registerGroundTerm("const.myconst", this.myConstExpression);

    let MyConstSensor = function(root) {
      if (root instanceof self.Term) {
        this.root = root;
      } else {
        this.root = self.expression(root);
      }
      this.sequence = new self.StateSequence(3);

      this._generateToken = function(task) {
        let token = new self.MyConstToken(_MYCONST, task);
        this.sequence.push(token);
        token.sequence = this.sequence;
        return token;
      };

      this.fireToken = function(tasks) {
        let token = this._generateToken(tasks);
        this.root.fire(token);
      };

      /*  This function is used to reset all the terms in your json.
       *  It has to be tested. */
      this.resetTerms = function() {
        this.root.reset();
      };
    };

    this.MyConstSensor = MyConstSensor;
  }
}

export default DjestitGeneric;

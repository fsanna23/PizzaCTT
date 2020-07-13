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

    this.registerGroundTerm("webtask", this.myConstExpression);

    /*
      The alternative expression generator used to associate an ID to
      the CompositeTerms; in this way, when they are completed, I can
      print their ID instead of the token's.
     */
    this.extendedExpression = function(json) {
      let exp = null;
      let ch = [];
      if (json.choice) {
        exp = new self.Choice();
        ch = json.choice;
      }

      if (json.disabling) {
        exp = new self.Disabling();
        ch = json.disabling;
      }

      if (json.anyOrder) {
        exp = new self.OrderIndependence();
        ch = json.anyOrder;
      }

      if (json.parallel) {
        exp = new self.Parallel();
        ch = json.parallel;
      }

      if (json.sequence) {
        exp = new self.Sequence();
        ch = json.sequence;
      }

      if (json.gt) {
        if (self._groundTerms[json.gt] !== undefined) {
          exp = self._groundTerms[json.gt](json);
        }
      }

      if (json.tid && !json.gt) {
        exp.id = json.tid;
      }

      if (json.complete) {
        exp.onComplete.add(json.complete);
      }

      if (json.error) {
        exp.onError.add(json.error);
      }

      // recoursively descend into sub expressions
      for (let i = 0; i < ch.length; i++) {
        let subterm = self.extendedExpression(ch[i]);
        exp.children.push(subterm);
      }

      if (json.iterative && json.iterative === true) {
        let it = exp;
        exp = new self.Iterative(it);
      }

      return exp;
    };

    let MyConstSensor = function(root) {
      if (root instanceof self.Term) {
        this.root = root;
      } else {
        this.root = self.extendedExpression(root);
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

      /*  This function is used to reset all the terms in your json. */
      this.resetTerms = function() {
        this.root.reset();
      };

      /*  This function lets you know if the token will go or not*/
      this.deepLookahead = function(tasks) {
        let token = this._generateToken(tasks);
        return this.root.lookahead(token);
      };
    };

    this.MyConstSensor = MyConstSensor;
  }
}

export default DjestitGeneric;

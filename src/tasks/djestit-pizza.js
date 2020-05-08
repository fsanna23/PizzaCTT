(function(djestit, undefined) {
  let _MYCONST = 1;

  let MyConstToken = function(type, id) {
    this.type = type;
    this.id = id;
  };
  MyConstToken.prototype = new djestit.Token();
  djestit.ConstToken = MyConstToken;

  let MyConst = function(id) {
    this.init();
    this.id = id;

    this._accepts = function(token) {
      return token.type === _MYCONST && token.tid === this.id;
    };
  };
  MyConst.prototype = new djestit.GroundTerm();
  djestit.MyConst = MyConst;

  djestit.myConstExpression = function(json) {
    if (json.gt) {
      return new djestit.MyConst();
    }
  };

  djestit.registerGroundTerm("const.myconst", djestit.myConstExpression);

  let MyConstSensor = function(root, capacity) {
    if (root instanceof djestit.Term) {
      this.root = root;
    } else {
      this.root = djestit.expression(root);
    }
    this.sequence = new djestit.StateSequence(capacity);
    let self = this;

    this._generateToken = function(type) {
      let token = new MyConstToken(type);
      this.sequence.push(token);
      token.sequence = this.sequence;
      return token;
    };

    this.fireToken = function(name) {
      let token = self._generateToken(name);
      self.root.fire(token);
    };

    /*  This function is used to reset all the terms in your json.
     *  It has to be tested. */
    this.resetTerms = function() {
      self.root.reset();
    };
  };

  djestit.MyConstSensor = MyConstSensor;
})((window.djestit = window.Djestit || {}), undefined);

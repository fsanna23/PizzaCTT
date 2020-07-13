class Djestit {
  constructor() {
    let _COMPLETE = 1;
    let _DEFAULT = 0;
    let _ERROR = -1;
    let self = this;

    /**
     * Constant indicating that an expression term is completed
     */
    this.COMPLETE = _COMPLETE;

    /**
     * Constant indicating that an expression term is in the default state
     * (neither completed nor error)
     */
    this.DEFAULT = _DEFAULT;

    /**
     * Constant indicating that an expression term is in an error state
     */
    this.ERROR = _ERROR;

    /**
     * Internal representation of an event (observer pattern)
     * @returns {this.Event}
     */
    let Event = function() {
      /**
       * The event callback list
       */
      this.callback = [];

      /**
       * Adds an handler for this event
       * @param {function} handler the handler to be added
       * @returns {undefined}
       */
      this.add = function(handler) {
        this.callback.push(handler);
      };

      /**
       * Removes an handler for this event
       * @param {function} handler the handler to be removed
       * @returns {undefined}
       */
      this.remove = function(handler) {
        let index = this.callback.indexOf(handler);
        if (index > -1) {
          this.callback.splice(index, 1);
        }
      };

      /**
       * Triggers the current event
       * @param {object} evt the event arguments
       * @returns {undefined}
       */
      this.trigger = function(evt, token) {
        this.callback.forEach(function(l) {
          l(evt);
        });
      };
    };

    /**
     * The base class representing the user input arguments
     * @returns {this.Token}
     */
    let Token = function() {};

    this.Token = Token;

    let StateSequence = function(capacity) {
      this.init = function(capacity) {
        this.capacity = capacity ? capacity : 2;
        this.tokens = [];
        this.index = -1;
      };

      this._push = function(token) {
        if (this.tokens.length > this.capacity) {
          this.tokens.push(token);
          this.index++;
        } else {
          this.index = (this.index + 1) % this.capacity;
          this.tokens[this.index] = token;
        }
      };

      this.push = function(token) {
        this._push(token);
      };

      this.get = function(delay) {
        let pos = Math.abs(this.index - delay) % this.capacity;
        return this.tokens[pos];
      };

      this.init(capacity);
    };

    this.StateSequence = StateSequence;

    /**
     * The base class for the input expression terms
     * @returns {this.Term}
     */
    let Term = function() {
      /**
       * Inits an expression term
       */
      this.init = function() {
        this.onComplete = new Event();
        this.onError = new Event();
        this.state = _DEFAULT;
      };

      /**
       * Executes the current expression term, passing a token as argument
       * @param {this.Token} token
       * @returns {undefined}
       */
      this.fire = function(token) {
        this.complete(token);
      };

      /**
       * Resets the the expression term to the initialization state
       * @returns {undefined}
       */
      this.reset = function() {
        this.state = _DEFAULT;
      };

      /**
       * Sets the expression state to completed
       * @param {this.Token} token the input parameters
       * @returns {undefined}
       */
      this.complete = function(token) {
        this.state = _COMPLETE;
        this.onComplete.trigger({
          evt: "completed",
          token: token,
          term: this
        });
      };

      /**
       * Sets the expression state in an error state
       * @param {this.Token} token the input parameters
       * @returns {undefined}
       */
      this.error = function(token) {
        this.state = _ERROR;
        this.onError.trigger({
          evt: "error",
          token: token
        });
      };

      /**
       * Test wheter the input can be accepted by the expression term or not
       * @param {this.Token} token the input parameters
       * @returns {Boolean} true if the input can be accepted, false otherwise
       */
      this.lookahead = function(token) {
        return true;
      };
    };
    this.Term = Term;

    /**
     * Base class for input ground terms (expressions that cannot be further
     * decomposed)
     * @extends Term
     * @returns {this.GroundTerm}
     */
    let GroundTerm = function() {
      this.init();
      // event filter, overridable by GroundTerm extensions (classes)
      this._accepts = function(token) {
        return true;
      };
      // event filter, overridable by specific instances
      this.accepts = function(token) {
        return true;
      };
      this.lookahead = function(token) {
        return this._accepts(token) && this.accepts(token);
      };
      this.type = "ground";
      this.modality = undefined;
    };
    GroundTerm.prototype = new Term();
    this.GroundTerm = GroundTerm;

    /**
     * Base class for composite expressions
     * @extends Term
     * @returns {this.CompositeTerm}
     */
    let CompositeTerm = function() {
      this.init();
      this.children = [];
      this.reset = function() {
        this.state = _DEFAULT;
        this.children.forEach(function(child) {
          child.reset();
        });
      };
    };
    CompositeTerm.prototype = new Term();
    this.CompositeTerm = CompositeTerm;

    /**
     * A composite expression of terms connected with the sequence operator.
     * The sequence operator expresses that the connected sub-terms (two or more)
     * have to be performed in sequence, from left to right.
     * @param {type} terms the list of sub-terms
     * @returns {this.Sequence}
     * @extends this.CompositeTerm
     */
    let Sequence = function(terms) {
      this.init();
      // setting the children property
      terms instanceof Array ? (this.children = terms) : (this.children = []);

      let self = this;
      self.index = 0;

      this.reset = function() {
        this.state = _DEFAULT;
        self.index = 0;
        this.children.forEach(function(child) {
          child.reset();
        });
      };

      this.lookahead = function(token) {
        if (this.state === _COMPLETE || this.state === _ERROR) {
          return false;
        }
        if (
          this.children &&
          this.children[self.index] &&
          this.children[self.index].lookahead
        ) {
          return this.children[self.index].lookahead(token);
        }
        return false;
      };

      this.fire = function(token) {
        if (this.lookahead(token) && this.children[self.index].fire) {
          this.children[self.index].fire(token);
        } else {
          this.error();
          return;
        }
        /* Switch finale per porre il this a completato.*/
        switch (this.children[self.index].state) {
          case _COMPLETE:
            self.index++;
            if (self.index >= this.children.length) {
              this.complete(token);
            }
            break;
          case _ERROR:
            this.error(token);
            break;
        }
      };
    };
    Sequence.prototype = new CompositeTerm();
    this.Sequence = Sequence;

    /**
     * A composite expression consisting of the iteration of a single term an
     * indefinite number of times
     * @param {type} term the term to iterate
     * @returns {this.Iterative}
     * @extends this.CompositeTerm
     */
    let Iterative = function(term) {
      this.init();
      // ensure that we set an unary operator
      term instanceof Array
        ? (this.children = term[0])
        : (this.children = term);

      this.reset = function() {
        this.state = _DEFAULT;
        if (this.children) {
          this.children.reset();
        }
      };

      this.lookahead = function(token) {
        if (this.children && this.children.lookahead) {
          return this.children.lookahead(token);
        }
      };

      this.fire = function(token) {
        if (this.lookahead(token) && this.children.fire) {
          this.children.fire(token);
          switch (this.children.state) {
            case _COMPLETE:
              this.complete(token);
              this.children.reset();
              break;

            case _ERROR:
              this.error(token);
              this.children.reset();
              break;
          }
        }
      };
    };
    Iterative.prototype = new CompositeTerm();
    this.Iterative = Iterative;

    /**
     * A composite expression of terms connected with the parallel operator.
     * The sequence operator expresses that the connected sub-terms (two or more)
     * can be executed at the same time
     * @param {type} terms the list of sub-terms
     * @returns {this.Parallel}
     * @extends this.CompositeTerm
     */
    let Parallel = function(terms) {
      this.init();
      // setting the children property
      terms instanceof Array ? (this.children = terms) : (this.children = []);

      this.lookahead = function(token) {
        if (this.state === _COMPLETE || this.state === _ERROR) {
          return false;
        }
        if (this.children && this.children instanceof Array) {
          for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].lookahead(token)) {
              return true;
            }
          }
        }
        return false;
      };

      this.fire = function(token) {
        let all = null;
        if (this.lookahead(token)) {
          all = true;
          this.children.forEach(function(child) {
            if (child.lookahead(token)) {
              child.fire(token);
            }
            if (child.state === _ERROR) {
              this.error(token);
            }
            all = all && child.state === _COMPLETE;
          });
        } else {
          this.error();
        }
        if (all === true) {
          this.complete(token);
        }
      };
    };
    Parallel.prototype = new CompositeTerm();
    this.Parallel = Parallel;

    /**
     * A composite expression of terms connected with the choice operator.
     * The sequence operator expresses that it is possible to select one among
     * the terms in order to complete the whole expression.
     * The implementation exploits a best effort approach for dealing with the
     * selection ambiguity problem (see [1])
     *
     * [1] Lucio Davide Spano, Antonio Cisternino, Fabio Paternò, and Gianni Fenu. 2013.
     * GestIT: a declarative and compositional framework for multiplatform
     * gesture definition. In Proceedings of the 5th ACM SIGCHI symposium on
     * Engineering interactive computing systems (EICS '13).
     * ACM, New York, NY, USA, 187-196
     *
     * @param {type} terms the list of sub-terms
     * @returns {this.Choice}
     * @extends this.CompositeTerm
     */
    let Choice = function(terms) {
      this.init();
      // setting the children property
      terms instanceof Array ? (this.children = terms) : (this.children = []);

      this.reset = function() {
        this.state = _DEFAULT;
        this.children.forEach(function(child) {
          child.reset();
          child._excluded = false;
        });
      };

      this.lookahead = function(token) {
        if (this.state === _COMPLETE || this.state === _ERROR) {
          return false;
        }
        if (this.children && this.children instanceof Array) {
          for (let i = 0; i < this.children.length; i++) {
            if (
              !this.children[i]._excluded &&
              this.children[i].lookahead(token) === true
            ) {
              return true;
            }
          }
        }
        return false;
      };

      this.feedToken = function(token) {
        if (this.state === _COMPLETE || this.state === _ERROR) {
          return;
        }

        if (this.children && this.children instanceof Array) {
          for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i]._excluded) {
              if (this.children[i].lookahead(token) === true) {
                this.children[i].fire(token);
              } else {
                // the current sub-term is not able to handle the input
                // sequence
                this.children[i]._excluded = true;
                this.children[i].error(token);
              }
            }
          }
        }
      };

      this.fire = function(token) {
        this.feedToken(token);
        let allExcluded = true;
        for (let i = 0; i < this.children.length; i++) {
          if (!this.children[i]._excluded) {
            allExcluded = false;
            switch (this.children[i].state) {
              case _COMPLETE:
                // one of the subterms is completed, then the
                // entire expression is completed
                this.complete(token);
                return;

              case _ERROR:
                // this case is never executed, since
                // feedToken excludes the subterms in error state
                return;
            }
          }
        }
        if (allExcluded) {
          // cannot complete any of the sub-terms
          this.error();
        }
      };
    };
    Choice.prototype = new CompositeTerm();
    this.Choice = Choice;

    let OrderIndependence = function(terms) {
      this.init();
      // setting the children property
      terms instanceof Array ? (this.children = terms) : (this.children = []);
      this.reset = function() {
        this.state = _DEFAULT;
        this.children.forEach(function(child) {
          child.reset();
          child._once = false;
          child._excluded = false;
        });
      };

      this.lookahead = function(token) {
        if (this.state === _COMPLETE || this.state === _ERROR) {
          return false;
        }
        if (this.children && this.children instanceof Array) {
          for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i]._once && this.children[i].lookahead(token)) {
              return true;
            }
          }
        }
        return false;
      };

      this.fire = function(token) {
        this.feedToken(token);
        let allComplete = true;
        let newSequence = false;
        let allExcluded = true;
        for (let i = 0; i < this.children.length; i++) {
          if (!this.children[i]._once) {
            if (!this.children[i]._excluded) {
              allExcluded = false;
              switch (this.children[i].state) {
                case _COMPLETE:
                  this.children[i]._once = true;
                  this.children[i]._excluded = true;
                  newSequence = true;
                  break;
                case _ERROR:
                  // this case is never executed, since
                  // feedToken excludes the subterms in error state
                  break;
                default:
                  allComplete = false;
                  break;
              }
            } else {
              allComplete = false;
            }
          }
        }
        if (allComplete) {
          // we completed all sub-terms
          this.complete(token);
          return;
        }
        if (allExcluded) {
          // no expression was able to handle the input
          this.error(token);
          return;
        }
        if (newSequence) {
          // execute a new sequence among those in order independence
          for (let i = 0; i < this.children.length; i++) {
            if (!this.children[i]._once) {
              this.children[i]._excluded = false;
              this.children[i].reset();
            }
          }
        }
      };
    };
    OrderIndependence.prototype = new Choice();
    this.OrderIndependence = OrderIndependence;

    let Disabling = function(terms) {
      this.init();
      terms instanceof Array ? (this.children = terms) : (this.children = []);

      this.fire = function(token) {
        this.feedToken(token);
        let allExcluded = true;
        let min = false;
        for (let i = 0; i < this.children.length; i++) {
          if (!this.children[i]._excluded) {
            min = true;
            allExcluded = false;
            switch (this.children[i].state) {
              case _COMPLETE:
                if (i === this.children.length - 1) {
                  // the expression is completed when the
                  // last subterm is completed
                  this.complete(token);
                }
                break;
            }
          } else {
            if (min) {
              // re-include terms with index > min for next
              // disabling term selection
              this.children[i]._excluded = false;
              this.children[i].reset();
            }
          }
        }
        if (allExcluded) {
          this.error(token);
          return;
        }
      };
    };
    Disabling.prototype = new Choice();
    this.Disabling = Disabling;

    /**
     * Creates an input expression (Term) from a declarative description
     * @param {object} json A json object describing the expression.
     * TODO specify json grammar
     * @returns {Term} the expression term
     */
    let expression = function(json) {
      let exp = null;
      let ch = [];
      if (json.choice) {
        exp = new Choice();
        ch = json.choice;
      }

      if (json.disabling) {
        exp = new Disabling();
        ch = json.disabling;
      }

      if (json.anyOrder) {
        exp = new OrderIndependence();
        ch = json.anyOrder;
      }

      if (json.parallel) {
        exp = new Parallel();
        ch = json.parallel;
      }

      if (json.sequence) {
        exp = new Sequence();
        ch = json.sequence;
      }

      if (json.gt) {
        if (self._groundTerms[json.gt] !== undefined) {
          exp = self._groundTerms[json.gt](json);
        }
      }

      if (json.complete) {
        exp.onComplete.add(json.complete);
      }

      if (json.error) {
        exp.onError.add(json.error);
      }

      // recoursively descend into sub expressions
      for (let i = 0; i < ch.length; i++) {
        let subterm = expression(ch[i]);
        exp.children.push(subterm);
      }

      if (json.iterative && json.iterative === true) {
        let it = exp;
        exp = new Iterative(it);
      }

      return exp;
    };

    this.expression = expression;

    this._groundTerms = [];
    this.registerGroundTerm = function(name, initFunction) {
      self._groundTerms[name] = initFunction;
    };

    this._select = function(selector, json) {
      const JSONSelect = require("./jsonselect");
      if (JSONSelect) {
        return JSONSelect.match(selector, json);
      } else {
        console.log(
          "In order to use the json selection capabilities, you must \
                  import the JSONSelect library http://jsonselect.org/"
        );
        return null;
      }
    };

    this._attachHandler = function(selector, expression, event, f) {
      let selection = self._select(selector, expression);
      for (let i = 0; i < selection.length; i++) {
        selection[i][event] = f;
      }
    };

    this.onComplete = function(selector, expression, f) {
      self._attachHandler(selector, expression, "complete", f);
    };

    this.onError = function(selector, expression, f) {
      self._attachHandler(selector, expression, "error", f);
    };
  }
}

export default Djestit;

/*We know that the djestit file contains things that we only need to use,
 * not to modify, therefore I really don't need to look at it. The only thing I need
 * to know about it is the way it handles the JSON expressions, which are used in
 * */

var _select = function(selector, json) {
  if (window.JSONSelect) {
    return window.JSONSelect.match(selector, json);
  } else {
    console.log(
      "In order to use the json selection capabilies, you must \
                use the JSONSelect library http://jsonselect.org/"
    );
    return null;
  }
};
djestit._select = _select;

/*Let's look at the djestit-touch.js file. We have to use some constants
 * like the ones in the beginning of the file.*/

var _TOUCHSTART = 1;
var _TOUCHMOVE = 2;
var _TOUCHEND = 3;

/*This constants are used in a touch-based-environment to specify the main
 * events that happen when a user interacts with the touch interface.
 * Therefore, this are useful to define things like pan, pinch and pointing,
 * all of them defined like JSON expressions in the djestitTouch_test1.js.
 * In a web-based-environment where the user can only interact with the
 * interface using mouse and keyboard, we only have the left mouse click
 * (at least in our pizza project, where we don't have things like
 * drag and drop or right click) and the key-down event, which we don't
 * really consider an event because the user doesn't have to write anything.
 * So, what can the constants be in our web interface?*/

/*Back in the djestit-touch.js file, we have the TouchToken class.*/

var TouchToken = function(touch, type) {
  this.clientX = touch.clientX;
  this.clientY = touch.clientY;
  this.pageX = touch.pageX;
  this.pageY = touch.pageY;
  this.screenX = touch.screenX;
  this.screenY = touch.screenY;
  this.target = touch.target;
  this.id = touch.identifier;
  this.type = type;
};
TouchToken.prototype = new djestit.Token();
djestit.TouchToken = TouchToken;

/*In djestit, we have that the Token is defined like this:*/

var Token = function() {};

djestit.Token = Token;

/*So, this isn't really a class, only a function without a body. The
 * prototype isn't really useful in our case. The only thing I can think
 * of when we do this is that we have some other functions in djestit
 * that can take an object of class Token, so we need to extend our
 * custom Token with the original Token class of the library.*/

/*The next thing in the djestit-touch.js file is the definition of
 * a class for each constant we created before. We can see that we have a
 * TouchStart, a TouchMove and a TouchEnd class; their body is pretty much
 * the same except for the token type which needs to be equal to the
 * relative constant. All of them extend the GroundTerm class.*/

/*Then we have the TouchStateSequence which extends the StateSequence class
 * from the djestit library. First, let's take a look to the StateSequence
 * class.*/

var StateSequence = function(capacity) {
  /*The init function is like a constructor for the class. It takes in input
   * the capacity and then it sets the capacity attribute equal to this value.
   * If we don't pass any capacity value, it's automatically set to 2.
   * That's because (I think) we have a sequence of states, then it's
   * only logical that we have at least two states: we can have a sequence
   * with only one state.
   *
   * We have a list of tokens and the index is initialized to -1.
   *  */

  this.init = function(capacity) {
    this.capacity = capacity ? capacity : 2;
    this.tokens = [];
    this.index = -1;
  };

  /*When the push function is called, we need to call it with a parameter
   * which is the token we want to add in our tokens list. The list can
   * actually exceed the capacity; in fact, if we insert tokens in the list
   * and the list length is less or equal the capacity, the index variable
   * stays on the right track (first 0, then 1, then 2 and so on).
   * If we exceed the capacity, it seems there is no problem: the token is
   * pushed at the end of the list and the index returns to 1; the more tokens
   * we add, the more the index value increases. I don't understand the meaning
   * of this.*/
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

  /*The get function uses a delay variable to get an item from our tokens
   * list. The problem is that if we exceed the capacity we won't get the
   * tokens that are over the capacity. For example, if the capacity was 2
   * and we added 5 tokens, we can only get the first three tokens.*/
  this.get = function(delay) {
    var pos = Math.abs(this.index - delay) % this.capacity;
    return this.tokens[pos];
  };

  this.init(capacity);
};

/*The TouchStateSequence is a little bit more complicated, because it adds
 * some variables. We have a touches list and a t_index list.*/

var TouchStateSequence = function(capacity) {
  this.init(capacity); //Standard initialization
  this.touches = [];
  this.t_index = [];

  /*The push function inserts the token in the tokens list (the one that
   * is showed in the StateSequence class), and also inserts it in
   * another list, the touches list. This list contains, for each id,
   * a list of tokens. To keep track of the index (just like the base
   * StateSequence class) we need to use an index variable. Because we
   * have a list of these, we also need to have a list of indices.
   * That's the reason we use the t_index list.*/
  this.push = function(token) {
    this._push(token);
    /*Here we have a switch the checks which type of token we are inserting
     * in our sequence.*/
    switch (token.type) {
      case _TOUCHSTART:
        /*If the token is a TouchStart type, we create a "list in a list":
         * at the token.id index of the touches list we insert another
         * empty list. At the token.id index of the t_index list we add
         * a 0 value instead.*/
        this.touches[token.id] = [];
        this.t_index[token.id] = 0;
      case _TOUCHMOVE: //Nothing happens
      case _TOUCHEND:
        /**/
        if (this.touches[token.id].length < this.capacity) {
          this.touches[token.id].push(token);
        } else {
          this.touches[token.id][this.t_index[token.id]] = token;
        }
        this.t_index[token.id] = (this.t_index[token.id] + 1) % this.capacity;
        break;
    }
  };

  this.getById = function(delay, id) {
    var pos = 0;
    if (this.touches[id].length < this.capacity) {
      pos = this.t_index[id] - delay - 1;
    } else {
      pos = (this.t_index[id] - delay - 1 + this.capacity) % this.capacity;
    }
    return this.touches[id][pos];
  };
};

TouchStateSequence.prototype = new djestit.StateSequence();

/*Next thing we have is the expressions definition. The JSON needs
 * to have a "gt" property where "gt" stands for GroundTerm. There's
 * a switch to check which type of GroundTerm we have: when we find
 * one that we created before, we return a new object of that
 * ground term class, giving them the right ID.*/

djestit.touchExpression = function(json) {
  if (json.gt) {
    switch (json.gt) {
      case "touch.start":
        return new djestit.TouchStart(json.tid);
        break;
      case "touch.move":
        return new djestit.TouchMove(json.tid);
        break;
      case "touch.end":
        return new djestit.TouchEnd(json.tid);
        break;
    }
  }
};

/*The expressions are used to create a registerGroundTerm. We are associating
 * that GroundTerm name to the */

djestit.registerGroundTerm("touch.start", djestit.touchExpression);
djestit.registerGroundTerm("touch.move", djestit.touchExpression);
djestit.registerGroundTerm("touch.end", djestit.touchExpression);

/*What's the TouchSensor function? Do I need it for my project?
 *
 * It seems that the TouchSensor class is used to associate an area of the
 * canvas used in the djestitTouch_test1 to some event listener, each one
 * for the TouchStart, the TouchMove and the TouchEnd events.
 * Therefore, if I have to use it, it would be overly simplified because
 * I only need to keep track of the mouse click event.
 * */

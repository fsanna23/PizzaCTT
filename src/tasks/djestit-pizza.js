/**
 * This file should be like "djestit-touch" but with less things
 */

(function(djestit, undefined) {
  var _MOUSECLICK = 1;

  var PizzaToken = function(id, type) {
    this.id = id;
    this.type = type;
  };
  PizzaToken.prototype = new djestit.Token();
  djestit.PizzaToken = PizzaToken;

  var MouseClick = function(id) {
    this.init();
    this.id = id;

    this._accepts = function(token) {
      if (token.type !== _MOUSECLICK) {
        return false;
      }
      if (this.id && this.id !== null && this.id !== token.id) {
        return false;
      }
      return true;
    };
  };
  MouseClick.prototype = new djestit.GroundTerm();
  djestit.MouseClick = MouseClick;

  /* The StateSequence isn't required here because there isn't
  a sequence of clicks to make in the interface in order to
  do something; there are single clicks only tasks.*/

  djestit.clickExpression = function(json) {
    if (json.gt) {
      switch (json.gt) {
        case "mouse.click":
          return new djestit.MouseClick(json.tid);
          break;
      }
    }
  };

  djestit.registerGroundTerm("mouse.click", djestit.clickExpression);
})((window.djestit = window.djestit || {}), undefined);

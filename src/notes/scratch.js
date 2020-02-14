/*
 * In the djestitTouch_test1 file, we have things that we need and
 * things that we don't need for our project. For example, the setCanvas
 * function is used to draw something on the touch project, therefore
 * we don't need it.
 *
 * The pan, pinch and pointing variables are instead useful, because
 * they show us how to create a JSON variable that will eventually
 * be given to some function in the djestit object.
 *
 * Let's take a look at this function here:
 * */

djestit.onComplete(':has(:root > .gt:val("touch.start"))', pan, function() {
  console.log("line added");
  currentLine = paintCanvas.addLine();
});

/*
 * Here we have a call on the onComplete function of the djestit object.
 * First, let's look at the function decleration in the djestit file.
 */

djestit.onComplete = function(selector, expression, f) {
  djestit._attachHandler(selector, expression, "complete", f);
};

/*
 * I takes three parameters: the first one is a selector, which seems to
 * always be like the one above, so ':has(:root > .gt:val("YOURCONSTANT"))'.
 * The second parameter is an expression; we know that this must be a JSON
 * expression, because pan is a JSON exp.
 * The third parameter is a function. This one is just something that the
 * interface needs to do when the onComplete function is called.
 *
 * We also see that this function calls itself another function, the
 * _attachHandler function, and gives to it the three parameters
 * and a fourth one, which is an event. In this case, we are telling
 * it that the event is "complete". That is because the onError function
 * is almost the same (has almost the same body) but passes an "error"
 * event.
 *
 * Now let's go deep inside this function and let's see what the
 * _attachHandler function does.
 * */

var _attachHandler = function(selector, expression, event, f) {
  var selection = djestit._select(selector, expression);
  for (var i = 0; i < selection.length; i++) {
    selection[i][event] = f;
  }
};

/*
 * It creates a variable selection with the function djestit._select,
 * passing to it the selector and the expression. From the lines
 * below, it seems that this selection is a matrix because it
 * uses two indices to get values from it: the "i" index and the
 * "event" index.
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

import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import DjestitGeneric from "../tasks/djestit-pizza-node";

class TaskModelStore extends ReduceStore {
  /**
   * Creates a new object of class TaskModelStore
   * @param jsonTree the task model tree in json format
   * @param taskMap a Map object containing the relationships between ActionTypes and tasks
   */
  constructor(jsonTree, taskMap) {
    super(Dispatcher);
    this._model = new DjestitGeneric();
    this._setDefaultCompleteActions(taskMap, jsonTree);
    this._sensor = new this._model.MyConstSensor(jsonTree);
    this._taskMap = taskMap;
  }

  /*   The getInitialState function is called before the constructor,
   *   and this means that you can't base your state on some variable
   *   that you got when you created the object. */
  getInitialState() {
    return {};
  }

  _setDefaultCompleteActions(taskMap, jsonTree) {
    let taskList = Array.from(taskMap.entries());
    taskList.forEach(entry => {
      if (entry[0] === "_subroots") {
        entry[1].forEach(task => {
          this._model.onComplete(
            ':has(:root > .srid:val("' + task + '"))',
            jsonTree,
            function(evt) {
              console.log("You have completed the task " + evt.term.srid);
            }
          );
        });
      } else {
        let task = entry[1];
        this._model.onComplete(
          ':has(:root > .tid:val("' + task + '"))',
          jsonTree,
          function(evt) {
            console.log("You have completed the task " + evt.token.id);
          }
        );
      }
    });
  }

  /*   In a Flux ReduceStore, the only way you can edit your state is
   *   through the reduce function, returning the new state with the
   *   changes you made. You can't modify it anywhere else.
   *   In our case, the state needs to be empty, so we return the
   *   same state we got from the reduce function (and it will remain
   *   unchanged). The actual actions are made on the taskMap variable. */
  reduce(state, action) {
    if (this._taskMap.has(action.type)) {
      let tasks = this._taskMap.get(action.type);
      if (tasks instanceof Array) {
        tasks.forEach(task => {
          this._sensor.fireToken(task);
        });
      } else {
        this._sensor.fireToken(tasks);
      }
      return state;
    } else {
      console.error("Please associate one or more tasks to this action");
      return state;
    }
  }
}

export default TaskModelStore;

import { ReduceStore } from "flux/utils";
import Dispatcher from "./Dispatcher";
import DjestitGeneric from "../tasks/djestit-webtasks-node";

class TaskModelStore extends ReduceStore {
  /**
   * Creates a new object of class TaskModelStore
   * @param jsonTree the task model tree in json format
   * @param taskMap a Map object containing the relationships between ActionTypes and tasks
   * @param taskHandlers a Map object containing the handlers for each task (optional)
   */
  constructor(jsonTree, taskMap, taskHandlers) {
    super(Dispatcher);
    this._taskMap = taskMap;
    this._model = new DjestitGeneric();
    this._setHandlers(taskMap, jsonTree, taskHandlers);
    this._sensor = new this._model.MyConstSensor(jsonTree);
  }

  /*   The getInitialState function is called before the constructor,
   *   and this means that you can't base your state on some variable
   *   that you got when you created the object. */
  getInitialState() {
    return {};
  }

  /**
   * Sets the handlers for each task. If the taskHandlers map is given when
   * the Store is created, then it'll use that to create the associations,
   * else it'll use the tasks inside the taskMap variable and it'll print
   * a default message of task completion
   */
  _setHandlers(taskMap, jsonTree, taskHandlers) {
    const taskList = taskHandlers
      ? Array.from(taskHandlers.entries())
      : Array.from(taskMap.entries());
    console.log(taskList);
    taskList.forEach(entry => {
      if (taskHandlers) {
        this._model.onComplete(
          ':has(:root > .tid:val("' + entry[0] + '"))',
          jsonTree,
          entry[1]
        );
      } else {
        if (entry[0] === "_subroots") {
          entry[1].forEach(task => {
            this._model.onComplete(
              ':has(:root > .tid:val("' + task + '"))',
              jsonTree,
              function(evt) {
                console.log("You have completed the task " + evt.term.id);
              }
            );
          });
        } else {
          this._model.onComplete(
            ':has(:root > .tid:val("' + entry[1] + '"))',
            jsonTree,
            function(evt) {
              console.log("You have completed the task " + evt.term.id);
            }
          );
        }
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
      const tasks = this._taskMap.get(action.type);
      /* If more than one tasks need to be fired when the action is executed */
      if (tasks instanceof Array) {
        // Fire all the tasks
        tasks.forEach(task => {
          this._sensor.fireToken(task);
        });
      } else {
        // Tasks is actually a single task and I need to fire only that task
        console.log("Firing  ->" + tasks);
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

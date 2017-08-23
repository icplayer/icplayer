/**
 * DEPRECATED! Please use DeferredSyncQueue
 * @module commons
 */
(function (window) {
    /**
     Commands dispatching utils.
     @class Commands
     */
    // Expose utils to the global object
    window.Commands = {
        /**
         Dispatches commands based on passed command name.
         @method dispatch

         @param {Object} commands hash table of available command (key: command name, value: method reference)
         @param {String} name name of command to be executed
         @param {Array} params array of string arguments to be passed to executed command method
         @param {Object} thisObject this object for method call
         @return {Object} executed command return value
         */
        dispatch: function dispatch(commands, name, params, thisObject) {
            var returnValue, command;

            for (command in commands) {
                if (Object.prototype.hasOwnProperty.call(commands, command) && command.toLowerCase() === name) {
                    if (commands[command]) {
                        returnValue = commands[command].call(thisObject, params);
                    }
                }
            }

            return returnValue;
        }
    };

    /**
     Factory class for commands queue creation.

     @class CommandsQueueFactory
     */
    window.CommandsQueueFactory = {
        /**
         * Creates new instance of {CommandsQueue} queue.
         *
         * @param {Object} module reference to module presenter
         * @returns {window.CommandsQueue} newly created, empty queue
         */
        create: function (module) {
            console.log("CommandsQueueFactory is deprecated and won't be maintained from now. Please use: DeferredSyncQueue");
            return new window.CommandsQueue(module);
        }
    };

    /**
     @param {String} name command name
     @param {Array} params command parameters
     @class CommandsQueueTask
     @constructor
     */
    window.CommandsQueueTask = function (name, params) {
        this.name = name;
        this.params = params;
    };

    /**
     Commands queue util.

     @class CommandsQueue
     @constructor
    */
    window.CommandsQueue = function (module) {
        this.module = module;
        this.queue = [];
    };

    /**
     Add passed task to the end of queue.

     @param {String} name command name
     @param {Array} params
     @method addTask
     */
    window.CommandsQueue.prototype.addTask = function (name, params) {
        var task = new window.CommandsQueueTask(name, params);

        this.queue.push(task);
    };

    /**
     Gets first element on the queue.

     @returns {Object} undefined if queue is empty, otherwise first task in queue
     */
    window.CommandsQueue.prototype.getTask = function () {
        if (this.isQueueEmpty()) return null;

        return this.queue.splice(0, 1)[0];
    };

    /**
     Gets all tasks on queue.

     @returns {Array} array of all tasks on queue
     */
    window.CommandsQueue.prototype.getAllTasks = function () {
        return this.queue;
    };

    /**
     Executes (and removes) first tasks from queue.
     */
    window.CommandsQueue.prototype.executeTask = function () {
        var task = this.getTask();

        if (!task) return;

        this.module.executeCommand(task.name.toLowerCase(), task.params);
    };

    /**
     Executes (and removes) all tasks from queue in FIFO manner (First In First Out) so that call sequence
     is sustained.
     */
    window.CommandsQueue.prototype.executeAllTasks = function () {
        while (!this.isQueueEmpty()) {
            this.executeTask();
        }
    };

    /**
     Gets queue tasks count.

     @returns {Number} tasks count
     */
    window.CommandsQueue.prototype.getTasksCount = function () {
        return this.queue.length;
    };

    /**
     Gets queue emptiness information.

     @returns {Boolean} true if queue is empty, otherwise false
     */
    window.CommandsQueue.prototype.isQueueEmpty = function () {
        return this.queue.length === 0;
    };
})(window);
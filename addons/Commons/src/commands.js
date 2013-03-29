/**
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
    }
})(window);
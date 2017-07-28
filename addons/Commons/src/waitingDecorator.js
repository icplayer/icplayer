/**
 * @module commons
 */
(function (window) {
    /**
    Waiting decorator util for functions which must wait for data before can be called.
    @class WaitingDecorator
    */
    window.WaitingDecorator = WaitingDecorator;

    /**
    Constructor.
     E.g of usage:

     var waitingDecorator = new window.WaitingDecorator();
     waitingDecorator.setIsAvailableCheckFunction(function () {
        return True;
     });

     presenter.someFunction = waitingDecorator.decorate(function (){});

     ...Some function
     waitingDecorator.callQueue();

    @return {null}
    */
    function WaitingDecorator() {
        this.queue = [];
        this.checkFunction = {
            self: null,
            functionToCall: null
        }
    }

    /**
     Push function to queue, which will be called while calling queue with passed scope and args

     @param {Object} self - scope for calling function.
     @param {Function} func - function which will be added to queue
     @param {[]} providedArgs - args which will be passed to called function
     @return {null}
    */
    WaitingDecorator.prototype.pushToQueue = function (self, func, providedArgs) {
        this.queue.push({
            functionToCall: func,
            argumentsToCall: providedArgs,
            self: self
        });
    };

    /**
     Check if function should be called or pushed to queue

     @return {Boolean} If true, then function should be called, else - push function to queue
    */
    WaitingDecorator.prototype.callIsAvailableCheckFunction = function () {
        return this.checkFunction.functionToCall.call(this.checkFunction.self);
    };

    /**
     Decorator for function

     E.g:
     presenter.someFunction = waitingDecorator.decorate(function (){});

     @return {Function} Decorated function
    */
    WaitingDecorator.prototype.decorate = function (fn) {
        var self = this;
        return function () {    // There should be another scope!
            if (self.callIsAvailableCheckFunction()) {
                return fn.apply(this, arguments);
            } else {
                var thisValue = this;
                self.pushToQueue(thisValue, fn, arguments);
            }
        }
    };

    /**
     Set function for checking if the decorator should call function or push to queue. If function will return true,
        then decorated function while calling will be called, if else then will called function be pushed to queue

     @param {Object} self - scope for calling function.
     @param {Function} functionToCall - function for checking if called function will be pushed to queue
     @return {null}
    */
    WaitingDecorator.prototype.setIsAvailableCheckFunction = function (self, functionToCall) {
        this.checkFunction.self = self;
        this.checkFunction.functionToCall = functionToCall;
    };

    /**
     Call all elements on queue in order: FIFO. This function must be called if whole data is loaded and functions on
        queue can be called.

     @return {null}
    */
    WaitingDecorator.prototype.callQueue = function () {
        for (var i = 0; i < this.queue.length; i++) {
            var queueElement = this.queue[i];
            queueElement.functionToCall.apply(queueElement.self, queueElement.argumentsToCall);
        }

        this.queue = [];
    };

})(window);

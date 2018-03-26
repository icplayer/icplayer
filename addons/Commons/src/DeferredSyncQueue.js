/**
 * @module commons
 */
(function (window) {
    function DeferredSyncQueueFactory (isAvailableCheckFunction) {
        var syncQueue = new DeferredSyncQueue();
        syncQueue.setIsAvailableCheckFunction(isAvailableCheckFunction);
        return syncQueue;
    }


    /**
    DeferredSyncQueue util for functions which must wait for data before can be called.
    @class DeferredSyncQueue
    @constructor
    */
    /**
    Constructor.
     E.g of usage:

     var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(function () {
        return True;
     });

     presenter.someFunction = deferredSyncQueue.decorate(function (){});

     ...Some function
     deferredSyncQueue.resolve();

    @return {null}
    */
    function DeferredSyncQueue() {
        this.queue = [];
        this.checkFunction = {
            functionToCall: null
        }
    }

    /**
     Push function to queue, which will be called while calling queue with passed scope and args
     @method push
     @param {Object} self - scope for calling function.
     @param {Function} func - function which will be added to queue
     @param {Object[]} providedArgs - args which will be passed to called function
     @return {null}
    */
    DeferredSyncQueue.prototype.push = function (self, func, providedArgs) {
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
    DeferredSyncQueue.prototype.callIsAvailableCheckFunction = function () {
        return this.checkFunction.functionToCall.call(this);
    };

    /**
     Decorator for function. If checkFunction is provided then this function will be called to check that function

     E.g:
     presenter.someFunction = deferredSyncQueue.decorate(function (){});
      @method decorate
      @param {Function} fn - function which will be deocrated
      @param {Function} checkFunction - function which will be called to check if decorated function should be called, if is undefined then default function will be called

      @return {Function} Decorated function
    */
    DeferredSyncQueue.prototype.decorate = function (fn, checkFunction) {
        var self = this;
        var functionToCall = checkFunction || this.callIsAvailableCheckFunction;
        return function () {    // There should be another scope!
            if (functionToCall.call(self)) {
                return fn.apply(this, arguments);
            } else {
                var thisValue = this;
                self.push(thisValue, fn, arguments);
            }
        }
    };

    /**
     Set function for checking if the decorator should call function or push to queue. If function will return true,
        then decorated function while calling will be called, if else then will called function be pushed to queue
     @method setIsAvailableCheckFunction
     @param {Function} functionToCall - function for checking if called function will be pushed to queue
     @return {null}
    */
    DeferredSyncQueue.prototype.setIsAvailableCheckFunction = function (functionToCall) {
        this.checkFunction.functionToCall = functionToCall;
    };

    /**
     Call all elements on queue in order: FIFO. This function must be called if whole data is loaded and functions on
        queue can be called.
     @method resolve
     @return {null}
    */
    DeferredSyncQueue.prototype.resolve = function () {
        var queLen = this.queue.length;
        for (var i = 0; i < queLen; i++) {
            var queueElement = this.queue[i];
            queueElement.functionToCall.apply(queueElement.self, queueElement.argumentsToCall);
        }

        this.queue = [];
    };

    window.DecoratorUtils = window.DecoratorUtils || {};
    window.DecoratorUtils.DeferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue || DeferredSyncQueueFactory;
})(window);

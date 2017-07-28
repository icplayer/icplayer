(function (window) {
    console.log("waiting!");
    var WaitingDecorator = function () {
        this.queue = [];
        this.checkFunction = {
            self: null,
            functionToCall: null
        }
    };

    WaitingDecorator.prototype.pushToQueue = function (self, func, providedArgs) {
        this.queue.push({
            functionToCall: func,
            argumentsToCall: providedArgs,
            self: self
        });
    };

    WaitingDecorator.prototype.callCheckFunction = function () {
        return this.checkFunction.functionToCall.call(this.checkFunction.self);
    };

    WaitingDecorator.prototype.decorate = function (fn) {
        var self = this;
        return function () {    // There should be another scope!
            if (self.callCheckFunction()) {
                self.pushToQueue(this, fn, arguments);
            } else {
                return fn.apply(this, arguments);
            }
        }
    };

    WaitingDecorator.prototype.setCheckFunction = function (self, functionToCall) {
        this.checkFunction.self = self;
        this.checkFunction.functionToCall = functionToCall;
    };

    WaitingDecorator.prototype.callStack = function () {
        for (var i = 0; i < this.queue.length; i++) {
            var queueElement = this.queue[i];
            queueElement.functionToCall.call(queueElement.self, queueElement.argumentsToCall);
        }

        this.queue = [];
    };

    window.WaitingDecorator = WaitingDecorator;

})(window);

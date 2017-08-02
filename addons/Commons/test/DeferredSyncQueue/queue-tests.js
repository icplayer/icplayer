TestCase("[Commons - WaitingDecorator] Queue tests", {
    setUp: function () {
        this.waitingDecorator = window.DecoratorUtils.DeferredSyncQueue();
    },

    'test added function to queue should be in this queue': function () {
        var stub1 = sinon.spy();
        var self1 = sinon.spy();
        var args1= ["a", "b", "c"];
        this.waitingDecorator.push(self1, stub1, args1);

        assertEquals(1, this.waitingDecorator.queue.length);
        assertEquals(self1, this.waitingDecorator.queue[0].self);
        assertEquals(args1, this.waitingDecorator.queue[0].argumentsToCall);
        assertEquals(stub1, this.waitingDecorator.queue[0].functionToCall);

        var stub2 = sinon.spy();
        var self2 = sinon.spy();
        var args2 = [1, 3, "s"];
        this.waitingDecorator.push(self2, stub2, args2);

        assertEquals(2, this.waitingDecorator.queue.length);
        assertEquals(self2, this.waitingDecorator.queue[1].self);
        assertEquals(args2, this.waitingDecorator.queue[1].argumentsToCall);
        assertEquals(stub2, this.waitingDecorator.queue[1].functionToCall);
    },

    'test all function added to queue should be called once with provided arguments. After calling queue should be empty': function () {
        var stub1 = sinon.spy();
        var self1 = sinon.spy();
        var args1= ["a", "b", "c"];
        this.waitingDecorator.push(self1, stub1, args1);

        var stub2 = sinon.spy();
        var self2 = sinon.spy();
        var args2 = [1, 3, "s"];
        this.waitingDecorator.push(self2, stub2, args2);

        this.waitingDecorator.resolve();

        assertTrue(stub1.calledOn(self1));
        assertTrue(stub1.calledWith("a", "b", "c"));
        assertTrue(stub1.calledOnce);

        assertTrue(stub2.calledOn(self2));
        assertTrue(stub2.calledWith(1, 3, "s"));
        assertTrue(stub2.calledOnce);

        assertEquals(0, this.waitingDecorator.queue.length)
    }
});
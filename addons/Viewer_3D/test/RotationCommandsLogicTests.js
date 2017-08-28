TestCase("[3D Viewer] Rotation commands logic - validate angle", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test angle is not a valid float': function () {
        var validatedAngle = this.presenter.validateAngle('value');

        assertFalse(validatedAngle.isValid);
    },

    'test angle is lower than 0': function () {
        var validatedAngle = this.presenter.validateAngle('-4');

        assertFalse(validatedAngle.isValid);
    },

    'test valid angle': function () {
        var validatedAngle = this.presenter.validateAngle('15.23');

        assertTrue(validatedAngle.isValid);
        assertEquals(15.23, validatedAngle.value);
    }
});

TestCase("[3D Viewer] Rotation commands logic - simple rotation", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.isLoaded = true;

        this.presenter.viewer = {
            update: function () {},
            rotate: function () {}
        };

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        sinon.stub(this.presenter.commandsQueue, 'addTask');
        sinon.stub(this.presenter, 'rotateObject');
    },

    'test rotate around X-axis with valid angle': function () {
        this.presenter.rotateX(10);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around X-axis with valid angle via command': function () {
        this.presenter.rotateXCommand(['10']);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around X-axis with negative angle': function () {
        this.presenter.rotateX(-45);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around X-axis with invalid angle': function () {
        this.presenter.rotateX(undefined);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around X-axis when addon is not fully loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.rotateX(10);

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals([10], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Y-axis with valid angle': function () {
        this.presenter.rotateY(10);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around Y-axis with valid angle via command': function () {
        this.presenter.rotateYCommand(['10']);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around Y-axis with negative angle': function () {
        this.presenter.rotateY(-45);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Y-axis with invalid angle': function () {
        this.presenter.rotateY(undefined);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Y-axis when addon is not fully loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.rotateY(10);

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals([10], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Z-axis with valid angle': function () {
        this.presenter.rotateZ(10);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around Z-axis with valid angle via command': function () {
        this.presenter.rotateZCommand(['10']);

        assertFalse(this.presenter.commandsQueue.addTask.called);

        assertTrue(this.presenter.rotateObject.calledOnce);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[0]);
        assertEquals(0, this.presenter.rotateObject.getCall(0).args[1]);
        assertEquals(10.00, this.presenter.rotateObject.getCall(0).args[2]);
    },

    'test rotate around Z-axis with negative angle': function () {
        this.presenter.rotateZ(-45);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Z-axis with invalid angle': function () {
        this.presenter.rotateZ(undefined);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.rotateObject.called);
    },

    'test rotate around Z-axis when addon is not fully loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.rotateZ(10);

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals([10], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.rotateObject.called);
    }
});
TestCase("[3D Viewer] Continuous rotation commands - validate delay", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
    },

    'test delay is not valid': function () {
        var validatedDelay = this.presenter.validateDelay('value');

        assertFalse(validatedDelay.isValid);
    },

    'test delay is negative': function () {
        var validatedDelay = this.presenter.validateDelay(-10);

        assertFalse(validatedDelay.isValid);
    },

    'test valid value': function () {
        var validatedDelay = this.presenter.validateDelay(50);

        assertTrue(validatedDelay.isValid);
        assertEquals(50, validatedDelay.value)
    }
});

TestCase("[3D Viewer] Continuous rotation commands", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.isLoaded = true;
        this.presenter.configuration = {
            queues: {
                X: {
                    name: '3D_Viewer1_X',
                    isActive: false,
                    delay: 0,
                    angle: 0
                },
                Y: {
                    name: '3D_Viewer1_Y',
                    isActive: false,
                    delay: 0,
                    angle: 0
                },
                Z: {
                    name: '3D_Viewer1_Z',
                    isActive: false,
                    delay: 0,
                    angle: 0
                }
            }
        };

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        sinon.stub(this.presenter.commandsQueue, 'addTask');

        sinon.stub(this.presenter, 'stopRotationX');
        sinon.stub(this.presenter, 'startRotationXQueue');
        sinon.stub(this.presenter, 'stopRotationXQueue');
    },

    tearDown: function () {
        this.presenter.stopRotationX();
        this.presenter.startRotationXQueue.restore();
        this.presenter.stopRotationXQueue.restore();
    },

    'test start rotation when addon is not fully loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.startRotation('X', 50, 30);

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals(['X', 50, 30], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.startRotationXQueue.called);
        assertFalse(this.presenter.stopRotationX.called);
    },

    'test start rotation with invalid angle': function () {
        this.presenter.startRotation('X', 'value', 30);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.startRotationXQueue.called);
        assertFalse(this.presenter.stopRotationX.called);
    },

    'test start rotation with invalid delay value': function () {
        this.presenter.startRotation('X', 50, 'value');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.startRotationXQueue.called);
        assertFalse(this.presenter.stopRotationX.called);
    },

    'test start rotation with valid params': function () {
        this.presenter.startRotation('X', 50, 30);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertTrue(this.presenter.startRotationXQueue.calledOnce);
        assertFalse(this.presenter.stopRotationX.called);

        assertTrue(this.presenter.configuration.queues.X.isActive);
        assertEquals(50, this.presenter.configuration.queues.X.angle);
        assertEquals(30, this.presenter.configuration.queues.X.delay);
    },

    'test start rotation when model is already rotating in this direction with same delay and angle': function () {
        this.presenter.configuration.queues.X.isActive = true;
        this.presenter.configuration.queues.X.angle = 50;
        this.presenter.configuration.queues.X.delay = 30;

        this.presenter.startRotation('X', 50, 30);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.startRotationXQueue.called);
        assertFalse(this.presenter.stopRotationX.called);

        assertTrue(this.presenter.configuration.queues.X.isActive);
        assertEquals(50, this.presenter.configuration.queues.X.angle);
        assertEquals(30, this.presenter.configuration.queues.X.delay);
    },

    'test start rotation when model is already rotating in this direction but with different parameters': function () {
        this.presenter.configuration.queues.X.isActive = true;
        this.presenter.configuration.queues.X.angle = 60;
        this.presenter.configuration.queues.X.delay = 45;

        this.presenter.startRotation('X', 50, 30);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.startRotationXQueue.called);
        assertFalse(this.presenter.stopRotationX.called);

        assertTrue(this.presenter.configuration.queues.X.isActive);
        assertEquals(50, this.presenter.configuration.queues.X.angle);
        assertEquals(30, this.presenter.configuration.queues.X.delay);
    },

    'test start rotation with delay equal to 0': function () {
        this.presenter.configuration.queues.X.isActive = true;

        this.presenter.startRotation('X', 50, 0);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.startRotationXQueue.called);
        assertTrue(this.presenter.stopRotationX.calledOnce);
    },

    'test stop rotation when addon is fully loaded': function () {
        this.presenter.stopRotationX.restore();
        this.presenter.configuration.queues.X.isActive = true;
        this.presenter.configuration.queues.X.delay = 30;
        this.presenter.configuration.queues.X.angle = 130;

        this.presenter.stopRotation('X');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertTrue(this.presenter.stopRotationXQueue.calledOnce);

        assertFalse(this.presenter.configuration.queues.X.isActive);
        assertEquals(0, this.presenter.configuration.queues.X.angle);
        assertEquals(0, this.presenter.configuration.queues.X.delay);

        sinon.stub(this.presenter, 'stopRotationX')
    },

    'test stop rotation when addon is not loaded': function () {
        this.presenter.stopRotationX.restore();
        this.presenter.configuration.queues.X.isActive = true;
        this.presenter.configuration.queues.X.delay = 30;
        this.presenter.configuration.queues.X.angle = 130;
        this.presenter.isLoaded = false;

        this.presenter.stopRotation('X');

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals(['X'], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.stopRotationXQueue.called);
        assertTrue(this.presenter.configuration.queues.X.isActive);
        assertEquals(130, this.presenter.configuration.queues.X.angle);
        assertEquals(30, this.presenter.configuration.queues.X.delay);

        sinon.stub(this.presenter, 'stopRotationX')
    },

    'test stop rotation when addon is fully loaded but queue is not active': function () {
        this.presenter.stopRotationX.restore();
        this.presenter.configuration.queues.X.isActive = false;

        this.presenter.stopRotation('X');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.stopRotationXQueue.called);

        sinon.stub(this.presenter, 'stopRotationX')
    }
});
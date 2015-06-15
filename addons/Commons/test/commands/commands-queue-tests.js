TestCase("[Commons - Commands] Commands queue - creation", {
    setUp: function () {
        this.presenter = { };
    },

    'test create new queue': function () {
        var queue = CommandsQueueFactory.create(this.presenter);

        assertNotUndefined(queue);
        assertEquals(this.presenter, queue.module);
    }
});

TestCase("[Commons - Commands] Commands queue - adding tasks", {
    setUp: function () {
        this.presenter = { };
    },

    'test add task to empty queue': function () {
        var queue = CommandsQueueFactory.create(this.presenter);

        queue.addTask('show', []);

        assertEquals(1, queue.queue.length);
        assertInstanceOf(CommandsQueueTask, queue.queue[0]);
        assertEquals('show', queue.queue[0].name);
        assertEquals([], queue.queue[0].params);
    },

    'test add task to not empty queue': function () {
        var queue = CommandsQueueFactory.create(this.presenter);
        queue.addTask('show', []);

        queue.addTask('addNumber', ['1']);

        assertEquals(2, queue.queue.length);
        assertInstanceOf(CommandsQueueTask, queue.queue[1]);
        assertEquals('addNumber', queue.queue[1].name);
        assertEquals(['1'], queue.queue[1].params);
    }
});

TestCase("[Commons - Commands] Commands queue - tasks retrieval", {
    setUp: function () {
        this.presenter = { };
        this.queue = CommandsQueueFactory.create(this.presenter);
    },

    'test get task from empty queue': function () {
        var task = this.queue.getTask();

        assertNull(task);
    },

    'test get task from queue with only one task': function () {
        this.queue.addTask('show', []);

        var task = this.queue.getTask();

        assertNotNull(task);
        assertInstanceOf(CommandsQueueTask, task);
        assertEquals('show', task.name);
        assertEquals([], task.params);
        assertEquals(0, this.queue.queue.length);
    },

    'test get task from queue with multiple tasks': function () {
        this.queue.addTask('show', []);
        this.queue.addTask('hide', []);

        var task = this.queue.getTask();

        assertNotNull(task);
        assertEquals('show', task.name);
        assertEquals([], task.params);

        assertEquals(1, this.queue.queue.length);
    },

    'test get all tasks from empty queue': function () {
        var tasks = this.queue.getAllTasks();

        assertArray(tasks);
        assertEquals(0, tasks.length);
    },

    'test get all tasks from queue with multiple tasks': function () {
        this.queue.addTask('show', []);
        this.queue.addTask('hide', []);

        var tasks = this.queue.getAllTasks();

        assertArray(tasks);
        assertEquals(2, tasks.length);
    }
});

TestCase("[Commons - Commands] Commands queue - tasks execution", {
    setUp: function () {
        this.presenter = {
            executeCommand: function(name, params) {}
        };

        this.executeCommandStub = sinon.stub(this.presenter, 'executeCommand');

        this.queue = CommandsQueueFactory.create(this.presenter);
    },

    tearDown: function () {
        this.presenter.executeCommand.restore();
    },

    'test execute task from empty queue': function () {
        this.queue.executeTask();

        assertFalse(this.executeCommandStub.called);
    },

    'test execute task from queue with only one element': function () {
        this.queue.addTask('show', []);

        this.queue.executeTask();

        assertTrue(this.executeCommandStub.calledWith('show', []));
    },

    'test execute task with name that is now lowercase': function () {
        this.queue.addTask('setState', []);

        this.queue.executeTask();

        assertTrue(this.executeCommandStub.calledWith('setstate', []));
    },

    'test execute task from queue with multiple elements': function () {
        this.queue.addTask('show', []);
        this.queue.addTask('hide', ['1']);

        this.queue.executeTask();

        assertTrue(this.executeCommandStub.calledWith('show', []));
    },

    'test execute all tasks from empty queue': function () {
        this.queue.executeAllTasks();

        assertFalse(this.executeCommandStub.called);
    },

    'test execute all tasks from queue with multiple elements': function () {
        this.queue.addTask('show', []);
        this.queue.addTask('hide', ['1']);

        this.queue.executeAllTasks();

        assertEquals(2, this.executeCommandStub.callCount);
    }
});

TestCase("[Commons - Commands] Commands queue - tasks count and emptiness", {
    setUp: function () {
        this.presenter = { };
        this.queue = CommandsQueueFactory.create(this.presenter);
    },

    'test empty queue': function () {
        var count = this.queue.getTasksCount();

        assertEquals(0, count);
        assertTrue(this.queue.isQueueEmpty());
    },

    'test multiple tasks on queue': function () {
        this.queue.addTask('show', []);
        this.queue.addTask('hide', ['1']);

        var count = this.queue.getTasksCount();

        assertEquals(2, count);
        assertFalse(this.queue.isQueueEmpty());
    }
});
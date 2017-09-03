TestCase("[3D Viewer] Commands logic - setQuality", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.configuration = {
            quality: 'standard'
        };
        this.presenter.isLoaded = true;

        this.presenter.viewer = {
            setDefinition: function () {},
            update: function () {}
        };

        sinon.stub(this.presenter.viewer, 'setDefinition');
        sinon.stub(this.presenter.viewer, 'update');

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        sinon.stub(this.presenter.commandsQueue, 'addTask');
    },

    tearDown: function () {
        this.presenter.commandsQueue.addTask.restore();
    },

    'test setQuality called when addon is not fully loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.setQuality('high');

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertEquals(['high'], this.presenter.getDeferredQueueVariable().queue[0].argumentsToCall);

        assertFalse(this.presenter.viewer.setDefinition.called);
        assertFalse(this.presenter.viewer.update.called);
    },

    'test setQuality with different than current definition': function () {
        this.presenter.setQuality('high');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertTrue(this.presenter.viewer.setDefinition.calledWith('high'));
        assertTrue(this.presenter.viewer.update.called);
        assertEquals('high', this.presenter.configuration.quality);
    },

    'test setQuality with definition same as current': function () {
        this.presenter.setQuality('standard');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.viewer.setDefinition.called);
        assertFalse(this.presenter.viewer.update.called);
    },

    'test setQuality with invalid definition': function () {
        this.presenter.setQuality('invalid');

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertFalse(this.presenter.viewer.setDefinition.called);
        assertFalse(this.presenter.viewer.update.called);
    },

    'test setQuality called via command': function () {
        this.presenter.setQualityCommand(['high']);

        assertFalse(this.presenter.commandsQueue.addTask.called);
        assertTrue(this.presenter.viewer.setDefinition.calledWith('high'));
        assertTrue(this.presenter.viewer.update.called);
        assertEquals('high', this.presenter.configuration.quality);
    }
});
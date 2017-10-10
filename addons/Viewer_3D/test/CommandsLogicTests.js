TestCase("[3D Viewer] Commands logic - reset", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.isLoaded = true;
        this.presenter.configuration = {
            files: {
                OBJ: '/files/server/221122'
            },
            isVisible: true
        };

        this.presenter.viewer = {
            update: function () {},
            replaceSceneFromUrl: function () {}
        };

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        this.stubs = {
            update: sinon.stub(this.presenter.viewer, 'update'),
            replace: sinon.stub(this.presenter.viewer, 'replaceSceneFromUrl'),
            quality: sinon.stub(this.presenter, 'setQuality'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            stopRotations: sinon.stub(this.presenter, 'stopAllRotations')
        };
    },

    'test reset when addon is loaded': function () {
        this.presenter.configuration.isCurrentlyVisible = false;
        this.presenter.configuration.quality = 'high';

        this.presenter.reset();

        assertTrue(this.stubs.quality.calledWith('standard'));
        assertTrue(this.stubs.stopRotations.calledOnce);

        assertTrue(this.stubs.replace.calledWith('/files/server/221122.obj'));
        assertTrue(this.stubs.update.calledOnce);

        assertEquals(0, this.presenter.getDeferredQueueVariable().queue.length);

        assertTrue(this.stubs.setVisibility.calledWith(true));
        assertTrue(this.presenter.configuration.isCurrentlyVisible);
    },

    'test reset when addon is not loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.reset();

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertFalse(this.stubs.quality.called);
        assertFalse(this.stubs.stopRotations.called);
        assertFalse(this.stubs.replace.called);
        assertFalse(this.stubs.update.called);
        assertFalse(this.stubs.setVisibility.called);
    }
});

TestCase("[3D Viewer] Commands logic - show / hide", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.isLoaded = true;
        this.presenter.configuration = {};

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        this.stubs = {
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            addTask: sinon.stub(this.presenter.commandsQueue, 'addTask')
        };
    },

    'test show when addon is loaded': function () {
        this.presenter.configuration.isCurrentlyVisible = false;

        this.presenter.show();

        assertTrue(this.stubs.setVisibility.calledWith(true));
        assertFalse(this.stubs.addTask.called);
        assertTrue(this.presenter.configuration.isCurrentlyVisible);
    },

    'test show when addon is not loaded': function () {
        this.presenter.isLoaded = false;
        this.presenter.configuration.isCurrentlyVisible = false;

        this.presenter.show();

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertFalse(this.stubs.setVisibility.called);
        assertFalse(this.presenter.configuration.isCurrentlyVisible);
    },

    'test hide when addon is loaded': function () {
        this.presenter.configuration.isCurrentlyVisible = true;

        this.presenter.hide();

        assertTrue(this.stubs.setVisibility.calledWith(false));
        assertFalse(this.stubs.addTask.called);
        assertFalse(this.presenter.configuration.isCurrentlyVisible);
    },

    'test hide when addon is not loaded': function () {
        this.presenter.isLoaded = false;
        this.presenter.configuration.isCurrentlyVisible = true;

        this.presenter.hide();

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertFalse(this.stubs.setVisibility.called);
        assertTrue(this.presenter.configuration.isCurrentlyVisible);
    }
});

TestCase("[3D Viewer] Commands logic - setState", {
    setUp: function () {
        this.presenter = AddonViewer_3D_create();
        this.presenter.isLoaded = true;
        this.presenter.configuration = {};

        this.presenter.commandsQueue = {
            addTask: function () {}
        };

        this.stubs = {
            show: sinon.stub(this.presenter, 'show'),
            hide: sinon.stub(this.presenter, 'hide'),
            addTask: sinon.stub(this.presenter.commandsQueue, 'addTask')
        };
    },

    'test setState with empty state': function () {
        this.presenter.setState(undefined);

        assertFalse(this.stubs.show.called);
        assertFalse(this.stubs.hide.called);
        assertFalse(this.stubs.addTask.called);
    },

    'test setState when addon is not loaded': function () {
        this.presenter.isLoaded = false;

        this.presenter.setState(JSON.stringify({ isVisible: true }));

        assertEquals(1, this.presenter.getDeferredQueueVariable().queue.length);
        assertFalse(this.stubs.show.called);
        assertFalse(this.stubs.hide.called);
    },

    'test setState when addon is loaded and should be visible': function () {
        this.presenter.setState(JSON.stringify({ isVisible: true }));

        assertTrue(this.stubs.show.called);
        assertFalse(this.stubs.hide.called);
        assertFalse(this.stubs.addTask.calledOnce);
    },

    'test setState when addon is loaded and should be invisible': function () {
        this.presenter.setState(JSON.stringify({ isVisible: false }));

        assertTrue(this.stubs.hide.called);
        assertFalse(this.stubs.show.called);
        assertFalse(this.stubs.addTask.calledOnce);
    }
});
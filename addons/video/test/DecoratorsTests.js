TestCase("[Video] callMetadataLoadedQueue", {
    setUp: function () {
        this.presenter = new Addonvideo_create();

        this.presenter.metadataQueue = [];
    },

    'test que have to be empty after call if was empty': function () {
        this.presenter.callMetadataLoadedQueue();

        assertEquals([], this.presenter.metadataQueue);
        assertEquals(0, this.presenter.metadataQueue.length);
    },

    'test que have to be empty after call if was not empty': function () {
        this.presenter.pushToMetadataQueue(function () {});
        this.presenter.pushToMetadataQueue(function () {});
        this.presenter.pushToMetadataQueue(function () {});

        this.presenter.callMetadataLoadedQueue();

        assertEquals([], this.presenter.metadataQueue);
        assertEquals(0, this.presenter.metadataQueue.length);
    },

    'test every function in que should be called with self parameter and provided arguments': function () {
        var stubs = {
            fn1: sinon.stub(),
            fn2: sinon.stub(),
            fn3: sinon.stub()
        };

        this.presenter.pushToMetadataQueue(stubs.fn1, [1, 2]);
        this.presenter.pushToMetadataQueue(stubs.fn2, [3, 4]);
        this.presenter.pushToMetadataQueue(stubs.fn3, ["a", "b"]);

        this.presenter.callMetadataLoadedQueue();

        assertTrue(stubs.fn1.calledOnce);
        assertTrue(stubs.fn2.calledOnce);
        assertTrue(stubs.fn3.calledOnce);

        assertTrue(stubs.fn1.calledWith(1,2));
        assertTrue(stubs.fn2.calledWith(3, 4));
        assertTrue(stubs.fn3.calledWith("a", "b"));
    }
});

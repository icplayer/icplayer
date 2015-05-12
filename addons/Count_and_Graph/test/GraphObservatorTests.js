TestCase("[Count_and_Graph] [Graph Observer] Are images rescalled", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.observer = new this.presenter.graphObserver();
    },

    'test images with base of 30 height shouldn\'t be treated as rescaled': function () {
        assertFalse(this.observer._areImagesRescaled(30));
        assertFalse(this.observer._areImagesRescaled(undefined));
    },

    'test images with other height than 30, should be treated as rescaled': function () {
        assertTrue(this.observer._areImagesRescaled(25));
        assertTrue(this.observer._areImagesRescaled(30.00005));
        assertTrue(this.observer._areImagesRescaled(1));
        assertTrue(this.observer._areImagesRescaled(60));
        assertTrue(this.observer._areImagesRescaled(98));
    }
});

TestCase("[Count_and_Graph] [Graph Observer] Update", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.observer = new this.presenter.graphObserver();

        this.stubs = {
            imageHasFinishedLoadingHandler: sinon.stub(this.observer, '_imageHasFinishedLoadingHandler'),
            graphHasFinishedLoadingHandler: sinon.stub(this.observer, '_graphHasFinishedLoadingHandler'),
            updateGraph: sinon.stub(this.observer, '_updateGraph')
        }
    },

    tearDown: function () {
        this.observer._imageHasFinishedLoadingHandler.restore();
        this.observer._graphHasFinishedLoadingHandler.restore();
        this.observer._updateGraph.restore();
    },

    'test when images has finished loading event incomes, only its handler should be called': function () {
        var event = {
            type: this.presenter.GRAPH_EVENT_TYPE.IMAGE_HAS_FINISHED_LOADING
        };

        this.observer.update(event);
        assertTrue(this.stubs.imageHasFinishedLoadingHandler.calledOnce);
        assertFalse(this.stubs.graphHasFinishedLoadingHandler.called);

        assertTrue(this.stubs.updateGraph.calledOnce);
    },

    'test when graph has finished loading event incomes, only its handler should be called': function () {
        var event = {
            type: this.presenter.GRAPH_EVENT_TYPE.GRAPH_HAS_FINISHED_LOADING
        };

        this.observer.update(event);
        assertFalse(this.stubs.imageHasFinishedLoadingHandler.called);
        assertTrue(this.stubs.graphHasFinishedLoadingHandler.calledOnce);

        assertTrue(this.stubs.updateGraph.calledOnce);
    }
});

TestCase("[Count_and_Graph] [Graph Observer] Events handlers validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.observer = new this.presenter.graphObserver();
        this.stubs = {
            setGraphShouldGetRescaled: sinon.stub(this.observer, '_setGraphShouldGetRescaled'),
            areImagesRescaled: sinon.stub(this.observer, 'areImagesRescaled'),
            updateGraph: sinon.stub(this.observer, '_updateGraph')
        };

        this.spies = {
            setObserverAfterImagesHasLoaded: sinon.spy(this.observer, '_setObserverAfterImagesHasLoaded'),
            setObserverAfterGraphHasLoaded: sinon.spy(this.observer, '_setObserverAfterGraphHasLoaded')
        };

        this.imageEvent = {
            data: {
                height: 50
            }
        };
    },

    tearDown: function () {
        this.observer._setGraphShouldGetRescaled.restore();
        this.observer.areImagesRescaled.restore();
        this.observer._setObserverAfterImagesHasLoaded.restore();
        this.observer._setObserverAfterGraphHasLoaded.restore();
        this.observer._updateGraph.restore();
    },

    'test after processing event, graph should be updated': function () {
        this.observer.update({});

        assertTrue(this.stubs.updateGraph.calledOnce);
    },

    'test image handler, when images havent been yet loaded': function () {

        this.stubs.areImagesRescaled.returns(false);

        this.observer._imageHasFinishedLoadingHandler(this.imageEvent);

        assertTrue(this.observer._imagesHasFinishedLoading);
        assertTrue(this.stubs.setGraphShouldGetRescaled.calledOnce);
        assertTrue(this.spies.setObserverAfterImagesHasLoaded.calledOnce);
    },

    'test image handler, when images have been loaded': function () {
        this.observer._imagesHasFinishedLoading = true;

        this.observer._imageHasFinishedLoadingHandler(this.imageEvent);

        assertFalse(this.stubs.setGraphShouldGetRescaled.called);
        assertFalse(this.spies.setObserverAfterImagesHasLoaded.called);
    },

    'test graph handler, when graph havent been yet loaded': function () {
        this.observer._graphHasFinishedLoadingHandler({});

        assertTrue(this.observer._graphHasFinishedLoading);
        assertTrue(this.stubs.setGraphShouldGetRescaled.calledOnce);
        assertTrue(this.spies.setObserverAfterGraphHasLoaded.calledOnce);
    },

    'test graph handler, when graph have been loaded': function () {
        this.observer._graphHasFinishedLoading = true;
        this.observer._graphHasFinishedLoadingHandler({});

        assertTrue(this.observer._graphHasFinishedLoading);
        assertFalse(this.stubs.setGraphShouldGetRescaled.called);
        assertFalse(this.spies.setObserverAfterGraphHasLoaded.called);
    }
});

TestCase("[Count_and_Graph] [Graph Observer] Task creation validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.observer = new this.presenter.graphObserver();

        this.stubs = {
            createRescailingTask: sinon.stub(this.observer, '_createRescalingTask'),
            createNullTask: sinon.stub(this.observer, '_createNullTask'),
            shouldCreateRescalingTask: sinon.stub(this.observer, '_shouldCreateRescalingTask')
        };
    },

    tearDown: function () {
        this.observer._createRescalingTask.restore();
        this.observer._createNullTask.restore();
    },

    'test triggering creation of null task': function () {
        this.stubs.shouldCreateRescalingTask.returns(false);

        this.observer._getUpdateGraphTask();

        assertTrue(this.stubs.createNullTask.calledOnce);
        assertFalse(this.stubs.createRescailingTask.called);
    },

    'test triggering creation of rescaling task': function () {
        this.stubs.shouldCreateRescalingTask.returns(true);

        this.observer._getUpdateGraphTask();

        assertTrue(this.stubs.createRescailingTask.calledOnce);
        assertFalse(this.stubs.createNullTask.called);
    }
});

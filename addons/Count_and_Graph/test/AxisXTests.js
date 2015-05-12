TestCase("[Count_and_Graph] [Axis X Object] Create dashes", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.columnsNumber = 5;
        this.axisX = new this.presenter.axisXObject(_, _, this.columnsNumber, _, _, _);
        this.stubs = {
            getVerticalDash: sinon.stub(this.axisX, '_getVerticalDash'),
            appendDash: sinon.stub(this.axisX.$view, 'append'),
            positionDash: sinon.stub(this.axisX, '_positionDash')
        };
    },

    tearDown: function () {
        this.axisX._getVerticalDash.restore();
        this.axisX._positionDash.restore();
        this.axisX.$view.append.restore();
    },

    'test there should be one more dash than number of columns and should be positioned': function () {
        this.axisX._createDashes();

        assertEquals(this.columnsNumber + 1, this.stubs.getVerticalDash.callCount);
        assertEquals(this.columnsNumber + 1, this.stubs.positionDash.callCount);
    }
});

TestCase("[Count_and_Graph] [Axis X Object] Create descriptions", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.columnsNumber = 5;
        this.seriesDescriptions = ["1", "2", "3", "4", "5"];
        this.imagesDescriptions = ["obrazek1", "obrazek2", "obrazek3", "obrazek4", "obrazek5"];

        this.axisX = new this.presenter.axisXObject(_, _, this.columnsNumber, this.seriesDescriptions, this.imagesDescriptions, _);
        this.stubs = {
            getTextDescription: sinon.stub(this.axisX, '_getTextDescription'),
            getImageDescription: sinon.stub(this.axisX, '_getImageDescription'),
            setDescriptionPosition: sinon.stub(this.axisX, '_setDescriptionPosition')
        };
    },

    tearDown: function () {
        this.axisX._getTextDescription.restore();
        this.axisX._getImageDescription.restore();
        this.axisX._setDescriptionPosition.restore();
    },

    'test when text description is avaible, images shouldnt be used': function () {
        this.axisX._createDescriptions();

        assertTrue(this.stubs.getTextDescription.called);
        assertEquals(this.seriesDescriptions.length, this.stubs.getTextDescription.callCount);

        assertFalse(this.stubs.getImageDescription.called);
    },

    'test when text description is empty, image should be used': function () {
        this.axisX._seriesDescriptions = ["1", "2", "", "", "5"];

        this.axisX._createDescriptions();

        assertTrue(this.stubs.getTextDescription.called);
        assertTrue(this.stubs.getImageDescription.called);

        assertEquals(2, this.stubs.getImageDescription.callCount);
        assertEquals(3, this.stubs.getTextDescription.callCount);
    }
});

TestCase("[Count_and_Graph] [Axis X Object] Should create text description", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.columnsNumber = 5;
        this.seriesDescriptions = ["1", "2", "3", "4", "5"];
        this.imagesDescriptions = ["obrazek1", "obrazek2", "obrazek3", "obrazek4", "obrazek5"];

        this.axisX = new this.presenter.axisXObject(_, _, this.columnsNumber, this.seriesDescriptions, this.imagesDescriptions, _);
    },

    'test when series description is non empty it should create text description': function () {
        assertTrue(this.axisX._shouldCreateTextDescription(0));
        assertTrue(this.axisX._shouldCreateTextDescription(1));
        assertTrue(this.axisX._shouldCreateTextDescription(2));
        assertTrue(this.axisX._shouldCreateTextDescription(3));
        assertTrue(this.axisX._shouldCreateTextDescription(4));
    },

    'test when series description is empty, it shouldnt create text description': function () {
        this.axisX._seriesDescriptions = ["1", "", "3", "", "5"];

        assertTrue(this.axisX._shouldCreateTextDescription(0));
        assertFalse(this.axisX._shouldCreateTextDescription(1));
        assertTrue(this.axisX._shouldCreateTextDescription(2));
        assertFalse(this.axisX._shouldCreateTextDescription(3));
        assertTrue(this.axisX._shouldCreateTextDescription(4));
    }
});

TestCase("[Count_and_Graph] [Axis X Object] Get image has finished loading event", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.axisX = new this.presenter.axisXObject(_, _, _, _, _, _, _, _, _, _, _);
    },

    'test event should be type of image has finished loading and contain image width & height information': function () {
        var expectedEvent = {
            type: this.presenter.GRAPH_EVENT_TYPE.IMAGE_HAS_FINISHED_LOADING,
            data: {
                width: 50,
                height: 50
            }
        };

        var eventValidation = this.axisX._getImageHasFinishedLoadingEvent(50, 50);

        assertEquals(expectedEvent, eventValidation)
    }
});

TestCase("[Count_and_Graph] [Axis X Object] Notify", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.axisX = new this.presenter.axisXObject(_, _, _, _, _, _, _, _, _, _, _);
        this.presenter.observer = new this.presenter.graphObserver();

        this.stubs = {
            update: sinon.stub(this.presenter.observer, 'update')
        };
    },

    tearDown: function () {
        this.presenter.observer.update.restore();
    },

    'test notifying observator should be with provided event and only once': function () {
        var expectedEvent = {
            type: "TestingEvent",
            data: "yupikajej"
        };

        this.axisX._notify(expectedEvent);

        assertTrue(this.stubs.update.calledOnce);
        assertTrue(this.stubs.update.calledWith(expectedEvent));
    }
});
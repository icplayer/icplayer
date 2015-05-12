TestCase("[Count_and_Graph] [Axis Y Object] Constructor", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test valid axis Y object creation': function () {
        var cyclicValue = [1];
        var fixedValues = undefined;
        var axisYMaximumValue = 10;
        var height = 30;
        var width = 30;


        var axisY = new this.presenter.axisYObject(axisYMaximumValue, width, height, cyclicValue, fixedValues);

        assertEquals(axisYMaximumValue, axisY._axisYMaximumValue);
        assertEquals(width, axisY._width);
        assertEquals(height, axisY._height);
        assertEquals(cyclicValue, axisY._cyclicValue);
        assertUndefined(axisY._fixedValues);
    }
});

TestCase("[Count_and_Graph] [Axis Y Object] Axis Y step", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;

        this.axisYObject = new this.presenter.axisYObject(_, _, _, _, _)
    },

    'test dashes should have been placed on Y axis evenly, rounded height': function () {
        this.axisYObject._axisYMaximumValue = 5;
        this.axisYObject._height = 500;

        var validationResult = this.axisYObject._getAxisYStep();

        assertEquals(100, validationResult);
    },

    'test dashes should have been placed on Y axis evenly, float height': function () {
        this.axisYObject._axisYMaximumValue = 5;
        this.axisYObject._height = 625.25;

        var validationResult = this.axisYObject._getAxisYStep();

        assertEquals(125.05, validationResult);
    }
});

TestCase("[Count_and_Graph] [Axis Y Object] Create axis Y lines ", {
    setUp: function () {
        var _ = 1;
        this.presenter = AddonCount_and_Graph_create();
        this.axisYObject = new this.presenter.axisYObject(_. _, _, _, _, _);

        this.stubs = {
            getDash: sinon.stub(this.axisYObject, '_getDash'),
            getAxisYStep: sinon.stub(this.axisYObject, '_getAxisYStep'),
            appendDashToContainer: sinon.stub(this.axisYObject, '_appendDashToContainer')
        };
    },

    tearDown: function () {
        this.axisYObject._getDash.restore();
        this.axisYObject._getAxisYStep.restore();
        this.axisYObject._appendDashToContainer.restore();
    },

    'test every Y axis value should have a dash': function () {
        this.axisYObject._axisYMaximumValue = 10;
        this.stubs.getDash.returns({});
        this.stubs.getAxisYStep.returns(30);

        this.axisYObject._createAxisYLines();

        assertEquals(11, this.stubs.getDash.callCount);
        assertEquals(11, this.stubs.appendDashToContainer.callCount);
    }
});

TestCase("[Count_and_Graph] [Axis Y Object] Get ticks values", {
    setUp: function () {
        var _ = 1;
        this.presenter = AddonCount_and_Graph_create();
        this.axisYObject = new this.presenter.axisYObject(10, _, _, _, _, _);
    },

    'test axis Y should start from 0 to max - all values show': function () {
        var expectedValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        this.axisYObject._fixedValues = undefined;
        this.axisYObject._cyclicValue = [1];

        var validationResult = this.axisYObject._getTicksValues();

        assertEquals(expectedValues, validationResult);

        expectedValues = [0, 2, 4, 6, 8, 10];

        this.axisYObject._cyclicValue = [2];

        validationResult = this.axisYObject._getTicksValues();

        assertEquals(expectedValues, validationResult);
    },

    'test axis Y values with fixed only': function () {
        var expectedValues = [1, 2, 5, 7];

        this.axisYObject._fixedValues = [1, 2, 5, 7];
        this.axisYObject._cyclicValue = undefined;

        var validationResult = this.axisYObject._getTicksValues();

        assertEquals(expectedValues, validationResult);
    }
});

TestCase("[Count_and_Graph] [Axis Y Object] Create ticks", {
    setUp: function () {
        var _ = 1;
        this.presenter = AddonCount_and_Graph_create();
        this.axisYObject = new this.presenter.axisYObject(10, _, _, _, _, _);
        this.spies = {
            getTick: sinon.spy(this.axisYObject, '_getTick'),
            appendTickToContainer: sinon.spy(this.axisYObject, '_appendTickToContainer')
        }
    },

    tearDown: function () {
        this.axisYObject._getTick.restore();
        this.axisYObject._appendTickToContainer.restore();
    },

    'test amount of created ticks & positioning operation should be equal to len of ticks values': function () {
        var ticksValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        this.axisYObject._createTicks(ticksValues);

        assertEquals(ticksValues.length, this.spies.getTick.callCount);
        assertEquals(ticksValues.length, this.spies.appendTickToContainer.callCount);
    },

    'test creation of ticks should be called with provided arguments': function () {
        var ticksValues = [0, 1, 2, 3, 4, 5];

        this.axisYObject._createTicks(ticksValues);

        assertEquals(6, this.spies.getTick.callCount);

        assertTrue(this.spies.getTick.getCall(0).calledWith(0));
        assertTrue(this.spies.getTick.getCall(1).calledWith(1));
        assertTrue(this.spies.getTick.getCall(2).calledWith(2));
        assertTrue(this.spies.getTick.getCall(3).calledWith(3));
        assertTrue(this.spies.getTick.getCall(4).calledWith(4));
        assertTrue(this.spies.getTick.getCall(5).calledWith(5));

    },

    'test ticks should have html text as provided': function () {
        var $validationResult = this.axisYObject._getTick(5);

        assertEquals("5", $validationResult.text());

        $validationResult = this.axisYObject._getTick(10);

        assertEquals("10", $validationResult.text());
    }
});
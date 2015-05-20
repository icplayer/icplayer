TestCase("[Slider] Events tests", {
    setUp : function() {
        this.presenter = AddonSlider_create();
        this.presenter.addonID = 'Slider1'
    },

    'test event for moving out of step has been created' : function() {
        var eventData = this.presenter.createEventData(4, false);
        assertEquals('Slider1', eventData.source);
        assertEquals('4', eventData.item);
        assertEquals('0', eventData.value);
    },

    'test event for moving intp  step has been created' : function() {
        var eventData = this.presenter.createEventData(4, true);
        assertEquals('Slider1', eventData.source);
        assertEquals('4', eventData.item);
        assertEquals('1', eventData.value);
    }
});

TestCase("[Slider] MouseUp triggering handler", {
    setUp: function () {
        this.presenter = AddonSlider_create();
        this.stubs = {
            mouseUpHandler: sinon.stub(this.presenter, 'mouseUpHandler')
        };

        this.presenter.mouseData = {
            isMouseDown: false
        };
    },

    tearDown: function () {
        this.presenter.mouseUpHandler.restore();
    },

    'test triggering mouse up handler should happen only when mouse was down': function () {
        this.presenter.mouseData.isMouseDown = true;

        this.presenter.mouseUpEventDispatcher({});

        assertTrue(this.stubs.mouseUpHandler.calledOnce);
    },

    'test triggering mouse up handler shouldnt happen when mouse wasnt down before': function () {
        this.presenter.mouseUpEventDispatcher({});

        assertFalse(this.stubs.mouseUpHandler.called);
    }
});
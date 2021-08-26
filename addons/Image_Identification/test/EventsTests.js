TestCase("Events", {
    setUp: function() {
        this.presenter = AddonImage_Identification_create();
        this.presenter.configuration = {
            addonID: 'ImageIdentification1',
            isActivity: true,
            shouldBeSelected: true
        };
        this.presenter.isGradualShowAnswersActive = false;

        this.stubs = {
            findStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            addClassStub: sinon.stub()
        };

        this.stubs.findStub.returns({
            removeClass: this.stubs.removeClassStub
        });

        this.stubs.removeClassStub.returns({
            addClass: this.stubs.addClassStub
        });

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
        };
    },

    'test element selection - should be selected': function() {
        var eventData = this.presenter.createEventData(true, true);
        assertEquals('ImageIdentification1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('1', eventData.score);
    },

    'test element deselection - should be selected': function() {
        var eventData = this.presenter.createEventData(false, true);
        assertEquals('ImageIdentification1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('0', eventData.value);
        assertEquals('1', eventData.score);
    },

    'test element selection - should not be selected': function() {
        var eventData = this.presenter.createEventData(true, false);
        assertEquals('ImageIdentification1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('0', eventData.score);
    },

    'test element deselection - should not be selected': function() {
        var eventData = this.presenter.createEventData(false, false);
        assertEquals('ImageIdentification1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('0', eventData.value);
        assertEquals('0', eventData.score);
    },

    'test module is not in activity mode': function() {
        this.presenter.configuration.isActivity = false;

        var eventData = this.presenter.createEventData(true, true);

        assertEquals('ImageIdentification1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('0', eventData.score); // if module was an activity score would be 1
    },

    'test showAnswers event calls the right method': function () {
        var eventName = "ShowAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.showAnswers.called);
    },

    'test hideAnswers event calls the right method': function () {
        var eventName = "HideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
    },

    'test GSA event calls the right method and changes isGradualShowAnswersActive to true': function () {
        var eventName = "GradualShowAnswers";
        var eventData = {
            moduleID: 'ImageIdentification1'
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.showAnswers.called);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test GHA event calls the right method and changes isGradualShowAnswersActive to false': function () {
        this.presenter.isGradualShowAnswersActive = true;
        var eventName = "GradualHideAnswers";
        var eventData = {};
        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.spies.hideAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    }

});

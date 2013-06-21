TestCase("Events", {
    setUp: function() {
        this.presenter = AddonImage_Identification_create();
        this.presenter.configuration = {
            addonID: 'ImageIdentification1',
            isActivity: true
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
    }
});
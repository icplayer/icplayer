TestCase("Events tests", {
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
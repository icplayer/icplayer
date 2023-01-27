TestCase("[Writing Calculations] Events tests", {
    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.model = {
            "ID" : 'WritingCalculations1'
        };
    },

    'test event for input filled in first row' : function() {
        var eventData = this.presenter.createEventData(3, "1-3", 1);

        assertEquals('WritingCalculations1', eventData.source);
        assertEquals('1-3', eventData.item);
        assertEquals('3', eventData.value);
        assertEquals('1', eventData.score);
    }
});

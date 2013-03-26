TestCase("Image Identification Create Event Data Tests", {
    'setUp': function () {
        this.presenter = Addontext_identification_create();
        this.presenter.addonID = 'text_identification1';
    },

    'test when should be selected and is selected': function() {
        this.presenter.shouldBeSelected = true;
        this.presenter.isSelected = true;
        var eventData = this.presenter.createEventData();
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '1',
            'score' : '1'
         };

        assertEquals('', expectedEventData, eventData)
    },

    'test when should be selected and is not selected': function() {
        this.presenter.shouldBeSelected = true;
        this.presenter.isSelected = false;
        var eventData = this.presenter.createEventData();
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '0',
            'score' : '1'
        };

        assertEquals('', expectedEventData, eventData)
    },

    'test when should not be selected and is selected': function() {
        this.presenter.shouldBeSelected = false;
        this.presenter.isSelected = true;
        var eventData = this.presenter.createEventData();
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '1',
            'score' : '0'
        };

        assertEquals('', expectedEventData, eventData)
    },

    'test when should not be selected and is not selected': function() {
        this.presenter.shouldBeSelected = false;
        this.presenter.isSelected = false;
        var eventData = this.presenter.createEventData();
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '0',
            'score' : '0'
        };

        assertEquals('', expectedEventData, eventData)
    }
});
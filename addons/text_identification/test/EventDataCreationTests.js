TestCase("[Text Identification] Event date creation", {
    'setUp': function () {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            addonID: 'text_identification1'
        };
    },

    'test when should be selected and is selected': function() {
        this.presenter.configuration.shouldBeSelected = true;
        this.presenter.configuration.isSelected = true;
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '1',
            'score' : '1'
        };

        var eventData = this.presenter.createEventData();

        assertEquals('', expectedEventData, eventData)
    },

    'test when should be selected and is not selected': function() {
        this.presenter.configuration.shouldBeSelected = true;
        this.presenter.configuration.isSelected = false;
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '0',
            'score' : '1'
        };

        var eventData = this.presenter.createEventData();

        assertEquals('', expectedEventData, eventData)
    },

    'test when should not be selected and is selected': function() {
        this.presenter.configuration.shouldBeSelected = false;
        this.presenter.configuration.isSelected = true;
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '1',
            'score' : '0'
        };

        var eventData = this.presenter.createEventData();

        assertEquals('', expectedEventData, eventData)
    },

    'test when should not be selected and is not selected': function() {
        this.presenter.configuration.shouldBeSelected = false;
        this.presenter.configuration.isSelected = false;
        var expectedEventData = {
            'source' : 'text_identification1',
            'item' : '1',
            'value' : '0',
            'score' : '0'
        };

        var eventData = this.presenter.createEventData();

        assertEquals('', expectedEventData, eventData)
    }
});
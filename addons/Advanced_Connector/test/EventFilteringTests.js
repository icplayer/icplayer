TestCase("Fields matching", {
    setUp: function() {
        this.presenter = AddonAdvanced_Connector_create();
    },

    'test field matches its rule': function() {
        var isMatch = this.presenter.matchFieldToRule('ImageViewer1', 'ImageViewer.*');

        assertTrue(isMatch);
    },

    'test field does not match its rule': function() {
        var isMatch = this.presenter.matchFieldToRule('ImageGap1', 'ImageViewer.*');

        assertFalse(isMatch);
    }
});

TestCase("Events filtering", {
    setUp: function() {
        this.presenter = AddonAdvanced_Connector_create();

        this.eventsDeclaration = [{
            Source: 'ImageViewer1',
            Item: '2',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        }, {
            Source: 'Slider.+',
            Item: '1-1',
            Value: '2',
            Score: '1',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        }, {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: 'babylon',
            Name: 'Definition',
            Code: ''
        }, {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: 'image',
            Word: '.*',
            Name: 'ItemSelected',
            Code: ''
        }, {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: 'image',
            Word: '.*',
            Name: 'Item*',
            Code: ''
        }, {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'NotAllAttempted',
            Code: ''
        }, {
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'AllAttempted',
            Code: ''
        }];
    },

    'test event data matches single event': function() {
        var event = {
            name: 'ValueChanged',
            source: 'ImageViewer1',
            item: '2',
            value: '1',
            score: '',
            type: '',
            word: ''
        };

        var filteredEvents = this.presenter.filterEvents(this.eventsDeclaration, event);

        assertEquals([this.eventsDeclaration[0]], filteredEvents);
    },

    'test event data does not match any event': function() {
        var event = {
            name: 'ValueChanged',
            source: 'ImageGap1',
            item: '2',
            value: '1',
            score: '',
            type: '',
            word: ''
        };

        var filteredEvents = this.presenter.filterEvents(this.eventsDeclaration, event);

        assertEquals([], filteredEvents);
    },

    'test event data matches Definition event': function() {
        var event = {
            name: 'Definition',
            source: '',
            item: '',
            value: '',
            score: '',
            type: '',
            word: 'babylon'
        };

        var filteredEvents = this.presenter.filterEvents(this.eventsDeclaration, event);

        assertEquals([this.eventsDeclaration[2]], filteredEvents);
    },

    'test event data matches several of draggable events': function() {
        var event = {
            name: 'ItemSelected',
            type: 'image',
            item: '1',
            value: '/file/serve/123456',
            source: '',
            score: '',
            word: ''
        };

        var filteredEvents = this.presenter.filterEvents(this.eventsDeclaration, event);

        assertEquals([this.eventsDeclaration[3]], filteredEvents);
    },

    'test event data matches only one of events': function() {
        this.eventsDeclaration[4].Type = 'text';

        var event = {
            name: 'ItemSelected',
            type: 'image',
            item: '',
            value: '',
            source: '',
            score: '',
            word: ''
        };

        var filteredEvents = this.presenter.filterEvents(this.eventsDeclaration, event);

        assertEquals([this.eventsDeclaration[3]], filteredEvents);
    }
});
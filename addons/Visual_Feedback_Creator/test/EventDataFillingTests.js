TestCase("Event data filling", {
    setUp: function () {
        this.presenter = AddonVisual_Feedback_Creator_create();
    },

    'test ValueChanged event data received': function () {
        var eventData = {
            source: 'ImageViewer1',
            item: '2',
            value: '1',
            score: ''
        }, expectedEventData = {
            name: 'ValueChanged',
            source: 'ImageViewer1',
            item: '2',
            value: '1',
            score: '',
            word: '',
            type: ''
        };

        var filledEventData = this.presenter.fillEventData(eventData, 'ValueChanged');

        assertEquals(expectedEventData, filledEventData);
    },

    'test ItemSelected event data received': function () {
        var eventData = {
            type: 'text',
            item: '2',
            value: 'babylon'
        }, expectedEventData = {
            name: 'ItemSelected',
            source: '',
            item: '2',
            value: 'babylon',
            score: '',
            word: '',
            type: 'text'
        };

        var filledEventData = this.presenter.fillEventData(eventData, 'ItemSelected');

        assertEquals(expectedEventData, filledEventData);
    },

    'test Definition event data received': function () {
        var eventData = {
            word: 'babylon'
        }, expectedEventData = {
            name: 'Definition',
            source: '',
            item: '',
            value: '',
            score: '',
            word: 'babylon',
            type: ''
        };

        var filledEventData = this.presenter.fillEventData(eventData, 'Definition');

        assertEquals(expectedEventData, filledEventData);
    },

    'test PageLoaded event data received': function () {
        var eventData = { },
        expectedEventData = {
            name: 'PageLoaded',
            source: '',
            item: '',
            value: '',
            score: '',
            word: '',
            type: ''
        };

        var filledEventData = this.presenter.fillEventData(eventData, 'PageLoaded');

        assertEquals(expectedEventData, filledEventData);
    }
});
TestCase("[Connection] Event data creation", {
    setUp: function() {
        this.presenter = AddonConnection_create();

        this.modelLeftSide = [{
            id: "1",
            content: "Sun is...",
            "connects to": "a",
            "additional class": ""
        }, {
            id: "2",
            content: "Grass is...",
            "connects to": "c",
            "additional class": ""
        }, {
            id: "3",
            content: "Sky is...",
            "connects to": "b",
            "additional class": ""
        }];

        this.modelRightSide = [{
            id: "a",
            content: "blue",
            "connects to": "",
            "additional class": ""
        }, {
            id: "b",
            content: "cloudy",
            "connects to": "",
            "additional class": ""
        }, {
            id: "c",
            content: "green",
            "connects to": "",
            "additional class": ""
        }];

        this.model = {
            "Left column": this.modelLeftSide,
            "Right column": this.modelRightSide
        };
    },

    'test left to right connection': function () {
        var expectedEventData = {
            'source': 'Connection1',
            'item': '1-a',
            'value': '1',
            'score': '1'
        };

        var eventData = this.presenter.createEventData('Connection1', "1", "a", this.model, 1, 1);

        assertEquals(expectedEventData, eventData);
    },

    'test right to left connection': function () {
        var expectedEventData = {
            'source': 'Connection1',
            'item': '1-b',
            'value': '1',
            'score': '1'
        };

        var eventData = this.presenter.createEventData('Connection1', "1", "b", this.model, 1, 1);

        assertEquals(expectedEventData, eventData);
    }
});

TestCase("[Connection] Event sending helper method - isAllOK", {
    setUp: function () {
        this.presenter = AddonConnection_create();

        sinon.stub(this.presenter, 'getMaxScore');
        this.presenter.getMaxScore.returns(2);

        sinon.stub(this.presenter, 'getScore');
        this.presenter.getScore.returns(0);

        sinon.stub(this.presenter, 'getErrorCount');
        this.presenter.getErrorCount.returns(0);
    },

    tearDown: function () {
        this.presenter.getMaxScore.restore();
        this.presenter.getScore.restore();
        this.presenter.getErrorCount.restore();
    },

    'test no selection were made': function () {
        assertFalse(this.presenter.isAllOK());
    },

    'test not enough selections were made': function () {
        this.presenter.getScore.returns(1);

        assertFalse(this.presenter.isAllOK());
    },

    'test enough selections were made with no errors': function () {
        this.presenter.getScore.returns(2);

        assertTrue(this.presenter.isAllOK());
    },

    'test enough selections were made but there wer also errors': function () {
        this.presenter.getScore.returns(2);
        this.presenter.getErrorCount.returns(1);

        assertFalse(this.presenter.isAllOK());
    }
});
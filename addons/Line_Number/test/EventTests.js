TestCase("Events Tests", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration.separator = '.';
        this.presenter.configuration.addonID = 'LN1';
    },

    'test convertRangeToString with simple range': function() {
        var range = {
            start: {
                value: 0,
                include: false
            },
            end: {
                value: 5,
                include: true
            }
        };

        var rangeString = this.presenter.convertRangeToString(range);

        assertEquals('(0; 5>', rangeString);
    },

    'test convertRangeToString with INF value': function() {
        var range = {
            start: {
                value: -Infinity,
                include: false
            },
            end: {
                value: 5,
                include: true
            }
        };

        var rangeString = this.presenter.convertRangeToString(range);

        assertEquals('(-INF; 5>', rangeString);
    },

    'test createEventData works as expected': function() {
        var rangeString = '(-INF; 5>';
        var isDelete = false;
        var isCorrect = true;
        var expectedData = {
            'source' : 'LN1',
            'item' : '(-INF; 5>',
            'value' : 1,
            'score' : 1
        };

        var eventData = this.presenter.createEventData(rangeString, isDelete, isCorrect);

        assertEquals(expectedData, eventData);
    }

});
TestCase("Get response index from ID", {
    setUp: function () {
        this.presenter = Addonfeedback_create();
        this.presenter.model = {
            Responses: [
                {'Unique response ID': 'RES-1'},
                {'Unique response ID': 'RES-2'},
                {'Unique response ID': 'RES-3'},
                {'Unique response ID': 'RES-4'},
                {'Unique response ID': 'RES-5'}
            ]
        }
    },

    'test response ID exists': function() {
        var responseIndex = this.presenter.getResponseIndex('RES-2');

        assertEquals(1, responseIndex);
    },

    'test response ID does not exist': function() {
        var responseIndex = this.presenter.getResponseIndex('RES-6');

        assertEquals(-1, responseIndex);
    }
});

TestCase("Get response ID from index", {
    setUp: function () {
        this.presenter = Addonfeedback_create();
        this.presenter.model = {
            Responses: [
                {'Unique response ID': 'RES-1'},
                {'Unique response ID': 'RES-2'},
                {'Unique response ID': 'RES-3'},
                {'Unique response ID': 'RES-4'},
                {'Unique response ID': 'RES-5'}
            ]
        }
    },

    'test response ID exists': function() {
        var responseID = this.presenter.getResponseID(2);

        assertEquals('RES-3', responseID);
    },

    'test response ID does not exist': function() {
        var responseID = this.presenter.getResponseID(6);

        assertUndefined(responseID)
    }
});
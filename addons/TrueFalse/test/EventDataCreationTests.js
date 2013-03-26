TestCase("Event data creation", {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();
        this.presenter.addonID = 'Connection1';
    },

    'test connection was created and it is correct connection': function () {
        var eventData = this.presenter.createEventData('1-5', false, true);

        assertEquals('Connection1', eventData.source);
        assertEquals('1-5', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('1', eventData.score);
    },

    'test connection was created but it is not correct connection': function () {
        var eventData = this.presenter.createEventData('1-5', false, false);

        assertEquals('Connection1', eventData.source);
        assertEquals('1-5', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('0', eventData.score);
    },

    'test connection was removed and it is incorrect connection': function () {
        var eventData = this.presenter.createEventData('1-5', true, true);

        assertEquals('Connection1', eventData.source);
        assertEquals('1-5', eventData.item);
        assertEquals('0', eventData.value);
        assertEquals('1', eventData.score);
    },

    'test connection was removed but it was correct connection': function () {
        var eventData = this.presenter.createEventData('1-5', true, false);

        assertEquals('Connection1', eventData.source);
        assertEquals('1-5', eventData.item);
        assertEquals('0', eventData.value);
        assertEquals('0', eventData.score);
    },

    'test AllOK event': function () {
        var eventData = this.presenter.createAllOKEventData('1-5', true, false);

        assertEquals('Connection1', eventData.source);
        assertEquals('all', eventData.item);
        assertEquals('', eventData.value);
        assertEquals('', eventData.score);
    }
});

TestCase("Event sending helper method - isAllOK", {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();

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

    'test no answers were selected': function () {
        assertFalse(this.presenter.isAllOK());
    },

    'test not enough answers were selected correctly': function () {
        this.presenter.getScore.returns(1);

        assertFalse(this.presenter.isAllOK());
    },

    'test enough answers were selected with no errors': function () {
        this.presenter.getScore.returns(2);

        assertTrue(this.presenter.isAllOK());
    },

    'test enough answers were selected but there wer also errors': function () {
        this.presenter.getScore.returns(2);
        this.presenter.getErrorCount.returns(1);

        assertFalse(this.presenter.isAllOK());
    }
});
TestCase("Events test", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        sinon.stub(this.presenter, 'sendAllOKEvent');
        sinon.stub(this.presenter, 'isAllOK');
        sinon.stub(this.presenter, 'cardReveal');

    },

    tearDown : function() {
        this.presenter.sendAllOKEvent.restore();
        this.presenter.isAllOK.restore();
        this.presenter.cardReveal.restore();
    },

    'test AllOK event should be sent': function () {

        this.presenter.isAllOK.returns(true);
        this.presenter.isActivity = true;
        this.presenter.addScoreAndSentEvent();

        assertTrue(this.presenter.cardReveal.called);
        assertTrue(this.presenter.sendAllOKEvent.called);
    },

    'test AllOK event should not be sent': function () {
        this.presenter.isAllOK.returns(false);

        this.presenter.addScoreAndSentEvent();

        assertTrue(this.presenter.cardReveal.called);
        assertFalse(this.presenter.sendAllOKEvent.called);
    }
});

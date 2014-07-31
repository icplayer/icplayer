TestCase("Events test", {
    setUp: function () {
        this.presenter = Addoncrossword_create();
        sinon.stub(this.presenter, 'sendAllOKEvent');
        sinon.stub(this.presenter, 'isAllOK');

    },

    tearDown : function() {
        this.presenter.sendAllOKEvent.restore();
        this.presenter.isAllOK.restore();
    },

    'test AllOK event should be sent': function () {
        this.presenter.isAllOK.returns(true);

        this.presenter.cellBlurEventHandler();

        assertTrue(this.presenter.sendAllOKEvent.called);
    },

    'test AllOK event should not be sent': function () {
        this.presenter.isAllOK.returns(false);

        this.presenter.cellBlurEventHandler();

        assertFalse(this.presenter.sendAllOKEvent.called);
    }
});

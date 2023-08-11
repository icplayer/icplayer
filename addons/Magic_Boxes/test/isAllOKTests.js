TestCase("[Magic Boxes] IsAllOK test", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
        sinon.stub(this.presenter, 'getMaxScore');
        sinon.stub(this.presenter, 'getScore');
        sinon.stub(this.presenter, 'getErrorCount');

    },
    tearDown : function() {
        this.presenter.getMaxScore.restore();
        this.presenter.getScore.restore();
        this.presenter.getErrorCount.restore();
    },

    'test isAllOk while score equals max score and no errors': function () {
        this.presenter.getScore.returns(2);
        this.presenter.getMaxScore.returns(2);
        this.presenter.getErrorCount.returns(1);

        assertFalse(this.presenter.isAllOK());
    },

    'test isAllOk while score equals max score and there are errors': function () {
        this.presenter.getScore.returns(2);
        this.presenter.getMaxScore.returns(2);
        this.presenter.getErrorCount.returns(0);

        assertTrue(this.presenter.isAllOK());
    },

    'test isAllOk while score does not equal max score': function () {
        this.presenter.getScore.returns(1);
        this.presenter.getMaxScore.returns(2);
        this.presenter.getErrorCount.returns(0);

        assertFalse(this.presenter.isAllOK());
    },

    'test isAllOk while score does not equal max score and are errors': function () {
        this.presenter.getScore.returns(1);
        this.presenter.getMaxScore.returns(2);
        this.presenter.getErrorCount.returns(2);

        assertFalse(this.presenter.isAllOK());
    },

    'test isAllOk while isErrorMode is true': function () {
        this.presenter.getScore.returns(1);
        this.presenter.getMaxScore.returns(2);
        this.presenter.getErrorCount.returns(2);

        this.presenter.isSelectionPossible = false;

        assertEquals(false, this.presenter.isAllOK());
    }
});

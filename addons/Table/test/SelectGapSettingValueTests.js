TestCase("[Table] Select gap show answers tests", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'id',
            gapWidth: { isSet: false },
            isActivity: true,
            gapMaxLength: {value: 12}
        };
        this.presenter.eventBus = sinon.spy();

        this.presenter.textParser = {
            escapeXMLEntities: sinon.stub()
        };

        this.gap = new this.presenter.SelectGap("gapId", ["correctAnswer"], 1);

        this.stubs = {
            setViewValueStub: sinon.stub(this.gap.$view, "val")
        };
    },

    tearDown: function () {
        this.gap.$view.val.restore();
    },

    'test given select gap when show answer called then calls escapeXMLEntities and sets the view value': function () {
        var expectedValue = "value";
        this.presenter.textParser.escapeXMLEntities.returns(expectedValue);

        this.gap.showAnswers();

        assertTrue(this.presenter.textParser.escapeXMLEntities.called);
        assertTrue(this.stubs.setViewValueStub.calledWith(expectedValue));
    }
});
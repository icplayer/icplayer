TestCase("[Page_Score_Counter] SetPrintableState tests", {
    setUp: function () {
        this.presenter = AddonPage_Score_Counter_create();

        this.stubs = {
            isStringEmptyStub: sinon.stub(),
        };
    },

    'test set printable state when state is null then except null': function() {
        this.stubs.isStringEmptyStub.returns(true);
        const state = null;

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test set printable state when state is empty then except null': function() {
        this.stubs.isStringEmptyStub.returns(true);
        const state = "";

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test set printable state when correct state': function() {
        this.stubs.isStringEmptyStub.returns(false);
        const state = '{"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 1}';
        const expectedState = {"isVisible": true, "isScoreVisible":true, "score": 1, "maxScore": 1};

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    }
});

TestCase("[Crossword] SetPrintableState tests", {
    setUp: function () {
        this.presenter = Addoncrossword_create();

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
        const state = '{"cells":[null, "D", null, "M", "A", "", null, "", null, null, "E", null],"isVisible": true}';
        const expectedState = {cells: [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined], isVisible: true};

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    },

    'test set printable state in old format when correct state': function() {
        this.stubs.isStringEmptyStub.returns(false);
        const state = '[null, "D", null, "M", "A", "", null, "", null, null, "E", null]';
        const expectedState = [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined];

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    },
});

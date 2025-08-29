TestCase("[Crossword] SetPrintableState tests", {
    setUp: function () {
        this.presenter = Addoncrossword_create();
    },

    'test given printableState with default value when setPrintableState is called with null then printableState should be null': function() {
        const state = null;

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with default value when setPrintableState is called with empty string then printableState should be null': function() {
        const state = "";

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with default value when setPrintableState is called with correct state string then printableState should be updated': function() {
        const state = '{"cells":[null, "D", null, "M", "A", "", null, "", null, null, "E", null],"isVisible": true}';
        const expectedState = {cells: [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined], isVisible: true};

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    },

    'test given printableState with default value when setPrintableState is called with correct old state string then printableState should be updated': function() {
        const state = '[null, "D", null, "M", "A", "", null, "", null, null, "E", null]';
        const expectedState = [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined];

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with null then printableState should be null': function() {
        this.presenter.printableState = [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined];
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with empty string then printableState should be null': function() {
        this.presenter.printableState = [undefined, "D", undefined, "M", "A", "", undefined, "", undefined, undefined, "E", undefined];
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    }
});

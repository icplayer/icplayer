TestCase("[TrueFalse] setPrintableState tests", {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();
    },

    'test given printableState with default value when setPrintableState is called with null then printableState should be null': function() {
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
        assertFalse(this.presenter.didUserRespond);
    },

    'test given printableState with default value when setPrintableState is called with empty string then printableState should be null': function() {
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
        assertFalse(this.presenter.didUserRespond);
    },

    'test given printableState with some value when setPrintableState is called with null then printableState should be null': function() {
        this.presenter.printableState = {"someKey": "Some state"};
        this.presenter.didUserRespond = true;
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
        assertFalse(this.presenter.didUserRespond);
    },

    'test given printableState with some value when setPrintableState is called with empty string then printableState should be null': function() {
        this.presenter.printableState = {"someKey": "Some state"};
        this.presenter.didUserRespond = true;
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
        assertFalse(this.presenter.didUserRespond);
    }
});

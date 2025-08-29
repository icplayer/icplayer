TestCase("[Text_Coloring] setPrintableState tests", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
    },

    'test given printableState with default value when setPrintableState is called with null then printableState should be null': function() {
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with default value when setPrintableState is called with empty string then printableState should be null': function() {
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with null then printableState should be null': function() {
        this.presenter.printableState = {"someKey": "Some state"};
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with empty string then printableState should be null': function() {
        this.presenter.printableState = {"someKey": "Some state"};
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    }
});

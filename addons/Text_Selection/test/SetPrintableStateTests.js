TestCase("[Text Selection] setPrintableState tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
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
        this.presenter.printableState = {numbers: ["3", "4"], isVisible: true, isExerciseStarted: true};
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with empty string then printableState should be null': function() {
        this.presenter.printableState = {numbers: ["3", "4"], isVisible: true, isExerciseStarted: true};
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState when setPrintableState is called with correct state then printableState should be updated': function() {
        const state = '{"numbers":["3","4"],"isVisible":true,"isExerciseStarted":true}';
        const expectedState = {numbers: ["3", "4"], isVisible: true, isExerciseStarted: true};

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    }
});

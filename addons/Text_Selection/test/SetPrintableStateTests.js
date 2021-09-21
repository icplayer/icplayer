TestCase("[Text Selection] SetPrintableState tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
    },

    'test set printable state when state is null then except null': function() {
        const state = null;

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test set printable state when state is empty then except null': function() {
        const state = "";

        this.presenter.setPrintableState(state);

        assertNull(this.presenter.printableState);
    },

    'test set printable state when correct state': function() {
        const state = '{"numbers":["3","4"],"isVisible":true,"isExerciseStarted":true}';
        const expectedState = {numbers: ["3", "4"], isVisible: true, isExerciseStarted: true};

        this.presenter.setPrintableState(state);

        assertEquals(expectedState, this.presenter.printableState);
    },
});

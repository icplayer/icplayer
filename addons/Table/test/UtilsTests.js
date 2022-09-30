TestCase("[Table] Get selected item", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.expectedData = {
            name: "testData",
            type: "a;lksjdjf"
        };
        this.presenter.configuration = {
            isVisible: true
        };
    },

    'test should return event data received from last received ItemSelected event': function () {
        this.presenter.onEventReceived("ItemSelected", this.expectedData);

        assertEquals(this.expectedData, this.presenter.getSelectedItem());
    }
});
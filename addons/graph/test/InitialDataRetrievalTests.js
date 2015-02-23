TestCase("[Graph] Initial data retrieval tests", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            data: [
                ["-0.1", "-0.2"],
                ["0.3", "0.4"],
                ["-1", "-2"],
                ["3", "4"]
            ]
        };
    },

    'test get initial data': function () {
        assertEquals(-0.1, this.presenter.getInitialData("0 0"));
        assertEquals(-0.2, this.presenter.getInitialData("0 1"));
        assertEquals(0.3, this.presenter.getInitialData("1 0"));
        assertEquals(0.4, this.presenter.getInitialData("1 1"));
        assertEquals(-1, this.presenter.getInitialData("2 0"));
        assertEquals(-2, this.presenter.getInitialData("2 1"));
        assertEquals(3, this.presenter.getInitialData("3 0"));
        assertEquals(4, this.presenter.getInitialData("3 1"));
    }
});
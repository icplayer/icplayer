TestCase("[Graph] Maximum interactive point", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            axisYMaximumValue: 4,
            interactiveStep: 1,
            data: [
                ["-0.1", "-0.2"],
                ["0.3", "0.4"],
                ["-1", "-2"],
                ["3", "4"]
            ]
        };
    },

    'test get maximum interactive point': function () {
        assertEquals(3.9, this.presenter.getMaximumInteractivePoint("0 0"));
        assertEquals(3.8, this.presenter.getMaximumInteractivePoint("0 1"));
        assertEquals(3.3, this.presenter.getMaximumInteractivePoint("1 0"));
        assertEquals(3.4, this.presenter.getMaximumInteractivePoint("1 1"));
        assertEquals(4, this.presenter.getMaximumInteractivePoint("2 0"));
        assertEquals(4, this.presenter.getMaximumInteractivePoint("2 1"));
        assertEquals(4, this.presenter.getMaximumInteractivePoint("3 0"));
        assertEquals(4, this.presenter.getMaximumInteractivePoint("3 1"));
    }
});

TestCase("[Graph] Minimum interactive point", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.presenter.configuration = {
            axisYMinimumValue: -4,
            interactiveStep: 1,
            data: [
                ["-0.1", "-0.2"],
                ["0.3", "0.4"],
                ["-1", "-2"],
                ["3", "4"]
            ]
        };
    },

    'test get maximum interactive point': function () {
        assertEquals(-3.1, this.presenter.getMinimumInteractivePoint("0 0"));
        assertEquals(-3.2, this.presenter.getMinimumInteractivePoint("0 1"));
        assertEquals(-3.7, this.presenter.getMinimumInteractivePoint("1 0"));
        assertEquals(-3.6, this.presenter.getMinimumInteractivePoint("1 1"));
        assertEquals(-4, this.presenter.getMinimumInteractivePoint("2 0"));
        assertEquals(-4, this.presenter.getMinimumInteractivePoint("2 1"));
        assertEquals(-4, this.presenter.getMinimumInteractivePoint("3 0"));
        assertEquals(-4, this.presenter.getMinimumInteractivePoint("3 1"));
    }
});
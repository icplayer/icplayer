TestCase("[Graph] Numbers sum with precision", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test get proper precision': function () {
        assertEquals(0, this.presenter.getProperPrecision(9, 1));
        assertEquals(1, this.presenter.getProperPrecision(1.9, 1));
        assertEquals(2, this.presenter.getProperPrecision(1.9, 1.01));
        assertEquals(3, this.presenter.getProperPrecision(1.911, 1.22));
    }
});
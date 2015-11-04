TestCase("IsAllOK test", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        this.presenter.isActivity = true;
    },

    'test isAllOk at the first attempt': function () {
        this.presenter.score = 2;
        this.presenter.maxScore = 2;

        assertEquals(2, this.presenter.getMaxScore());
        assertEquals(2, this.presenter.getScore());

        assertTrue(this.presenter.isAllOK());
    },

    'test isAllOk is true despite errors': function () {
        this.presenter.score = 2;
        this.presenter.maxScore = 2;

        this.presenter.errorCount = 2;

        assertEquals(2, this.presenter.getMaxScore());
        assertEquals(2, this.presenter.getScore());

        assertTrue(this.presenter.isAllOK());
    },

    'test isAllOk while score does not equal max score': function () {
        this.presenter.score = 1;
        this.presenter.maxScore = 2;

        assertEquals(2, this.presenter.getMaxScore());
        assertEquals(1, this.presenter.getScore());

        assertFalse(this.presenter.isAllOK());
    }
});

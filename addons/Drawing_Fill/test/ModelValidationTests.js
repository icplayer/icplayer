TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonDrawing_Fill_create();
        this.model = {

        };
        this.presenter.configuration = {
            'tolerance' : 100
        };
    },

    'test compareColors true': function () {
        var compareResult = this.presenter.compareColors([255, 255, 255, 255], [250, 155, 200, 250]);
        assertEquals(true, compareResult);
    },

    'test compareColors false': function () {
        var compareResult = this.presenter.compareColors([255, 255, 255, 255], [250, 154, 200, 250]);
        assertEquals(false, compareResult);
    }
});
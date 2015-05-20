TestCase("[Slider] Steps count conversion", {
    setUp: function () {
        this.presenter = AddonSlider_create();
    },

    'test steps count incorrect': function () {
        var conversionResult = this.presenter.convertStepsCount("number");

        assertTrue(conversionResult.isError);
        assertEquals('SC_01', conversionResult.errorCode);
    },

    'test steps count too small': function () {
        var conversionResult = this.presenter.convertStepsCount("1");

        assertTrue(conversionResult.isError);
        assertEquals('SC_02', conversionResult.errorCode);
    },

    'test valid steps count': function () {
        var conversionResult = this.presenter.convertStepsCount("3");

        assertFalse(conversionResult.isError);
        assertEquals(3, conversionResult.stepsCount);
    }
});
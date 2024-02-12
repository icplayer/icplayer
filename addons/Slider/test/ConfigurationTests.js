TestCase("[Slider] Configuration", {
    setUp: function () {
        this.presenter = AddonSlider_create();
    },

    'test image element error': function () {
        var model = {};

        var conversionResult = this.presenter.convertModel(model);

        assertBoolean(conversionResult.isError);
        assertEquals('ES_01', conversionResult.errorCode);
    },

    'test initial step error': function () {
        var model = {
            ImageElement : "/files/serve/image.png",
            Stepwise: "True",
            StepsCount: 6,
            InitialStep: "aa"
        };

        var conversionResult = this.presenter.convertModel(model);

        assertTrue(conversionResult.isError);
        assertEquals('IS_01', conversionResult.errorCode);
    },

    'test steps count error': function () {
        var model = {
            ImageElement : "/files/serve/image.png",
            Stepwise: "True",
            StepsCount: 1
        };

        var conversionResult = this.presenter.convertModel(model);

        assertTrue(conversionResult.isError);
        assertEquals('SC_02', conversionResult.errorCode);
    },

    'test proper config with default values': function () {
        var model = {
            "Is Visible": "True",
            ImageElement : "/files/serve/image.png",
            "Alternative texts": [{"Alternative text": '', "Step number": ''}],
            speechTexts: {Step: {Step: ''}},
            langAttribute: '',
            StepwiseModeBarAlwaysVisible: "False"
        };

        var conversionResult = this.presenter.convertModel(model);

        assertFalse(conversionResult.isError);
        assertFalse(conversionResult.stepwise);
        assertEquals(0, conversionResult.stepsCount);
        assertEquals(1, conversionResult.initialStep);
        assertEquals(this.presenter.ORIENTATION.LANDSCAPE, conversionResult.orientation);
        assertTrue(conversionResult.isVisibleByDefault);
        assertTrue(conversionResult.isVisible);
        assertFalse(conversionResult.stepwiseModeBarAlwaysVisible);

        assertFalse(conversionResult.isErrorMode);
        assertFalse(conversionResult.shouldBlockInErrorMode);
    },

    'test proper config for stepwise': function () {
        var model = {
            "Is Visible": "True",
            ImageElement : "/files/serve/image.png",
            Stepwise: "True",
            StepsCount: 6,
            InitialStep: 3,
            "Alternative texts": [{"Alternative text": '', "Step number": ''}],
            speechTexts: {Step: {Step: ''}},
            langAttribute: ''
        };

        var conversionResult = this.presenter.convertModel(model);

        assertFalse(conversionResult.isError);
        assertTrue(conversionResult.stepwise);
        assertEquals(6, conversionResult.stepsCount);
        assertEquals(3, conversionResult.initialStep);
        assertEquals(this.presenter.ORIENTATION.LANDSCAPE, conversionResult.orientation);

        assertFalse(conversionResult.isErrorMode);
        assertFalse(conversionResult.shouldBlockInErrorMode);
    }
});

TestCase("[Graph] Model validation flow", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.stubs = {
            axisYMaximumValue: sinon.stub(this.presenter, 'validateAxisYMaximumValue'),
            axisYMinimumValue: sinon.stub(this.presenter, 'validateAxisYMinimumValue'),
            axisYRange: sinon.stub(this.presenter, 'validateAxisYRange'),
            axisYGridStep: sinon.stub(this.presenter, 'validateAxisYGridStep'),
            interactiveStep: sinon.stub(this.presenter, 'validateInteractiveStep'),
            colors: sinon.stub(this.presenter, 'parseColors'),
            data: sinon.stub(this.presenter, 'validateData'),
            axisXBars: sinon.stub(this.presenter, 'validateAxisXBarsDescriptions'),
            axisXSeries: sinon.stub(this.presenter, 'validateAxisXSeriesDescriptions'),
            answers: sinon.stub(this.presenter, 'validateAnswers'),
            results: sinon.stub(this.presenter, 'parseResults'),
            axisYValues: sinon.stub(this.presenter, 'validateAxisYValues')
        };
    },

    tearDown: function () {
        this.presenter.validateAxisYMaximumValue.restore();
        this.presenter.validateAxisYMinimumValue.restore();
        this.presenter.validateAxisYRange.restore();
        this.presenter.validateAxisYGridStep.restore();
        this.presenter.validateInteractiveStep.restore();
        this.presenter.parseColors.restore();
        this.presenter.validateData.restore();
        this.presenter.validateAxisXBarsDescriptions.restore();
        this.presenter.validateAxisXSeriesDescriptions.restore();
        this.presenter.validateAnswers.restore();
        this.presenter.parseResults.restore();
        this.presenter.validateAxisYValues.restore();
    },

    'test axis y maximum fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);

        assertFalse(this.stubs.axisYMinimumValue.called);
        assertFalse(this.stubs.axisYRange.called);
        assertFalse(this.stubs.axisYGridStep.called);
        assertFalse(this.stubs.interactiveStep.called);
        assertFalse(this.stubs.colors.called);
        assertFalse(this.stubs.data.called);
        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis y minimum fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);

        assertFalse(this.stubs.axisYRange.called);
        assertFalse(this.stubs.axisYGridStep.called);
        assertFalse(this.stubs.interactiveStep.called);
        assertFalse(this.stubs.colors.called);
        assertFalse(this.stubs.data.called);
        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis y range fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);

        assertFalse(this.stubs.axisYGridStep.called);
        assertFalse(this.stubs.interactiveStep.called);
        assertFalse(this.stubs.colors.called);
        assertFalse(this.stubs.data.called);
        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis y grid step fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);

        assertFalse(this.stubs.interactiveStep.called);
        assertFalse(this.stubs.colors.called);
        assertFalse(this.stubs.data.called);
        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test interactive step fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.interactiveStep.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);

        assertFalse(this.stubs.colors.called);
        assertFalse(this.stubs.data.called);
        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test data validation fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);

        assertFalse(this.stubs.axisXBars.called);
        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis x bars fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: true, value: {barsCount: {}, validRows: {}, parsedData: {}}});
        this.stubs.axisXBars.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);
        assertTrue(this.stubs.axisXBars.called);

        assertFalse(this.stubs.axisXSeries.called);
        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis x series fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: true, value: {barsCount: {}, validRows: {}, parsedData: {}}});
        this.stubs.axisXBars.returns({isValid: true, value: {showXAxisBarsDescriptions: {}, axisXBarsDescriptions: {}}});
        this.stubs.axisXSeries.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);
        assertTrue(this.stubs.axisXBars.called);
        assertTrue(this.stubs.axisXSeries.called);

        assertFalse(this.stubs.answers.called);
        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test answers fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: true, value: {barsCount: {}, validRows: {}, parsedData: {}}});
        this.stubs.axisXBars.returns({isValid: true, value: {showXAxisBarsDescriptions: {}, axisXBarsDescriptions: {}}});
        this.stubs.axisXSeries.returns({isValid: true, value: {showXAxisSeriesDescriptions: {}, axisXSeriesDescriptions: {}}});
        this.stubs.answers.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);
        assertTrue(this.stubs.axisXBars.called);
        assertTrue(this.stubs.axisXSeries.called);
        assertTrue(this.stubs.answers.called);

        assertFalse(this.stubs.results.called);
        assertFalse(this.stubs.axisYValues.called);
    },

    'test axis y values fail': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: true, value: {barsCount: {}, validRows: {}, parsedData: {}}});
        this.stubs.axisXBars.returns({isValid: true, value: {showXAxisBarsDescriptions: {}, axisXBarsDescriptions: {}}});
        this.stubs.axisXSeries.returns({isValid: true, value: {showXAxisSeriesDescriptions: {}, axisXSeriesDescriptions: {}}});
        this.stubs.answers.returns({isValid: true, answers: {}});
        this.stubs.results.returns({});
        this.stubs.axisYValues.returns({isValid: false, errorCode: "fail"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);
        assertTrue(this.stubs.axisXBars.called);
        assertTrue(this.stubs.axisXSeries.called);
        assertTrue(this.stubs.answers.called);
        assertTrue(this.stubs.results.called);
        assertTrue(this.stubs.axisYValues.called);
    },

    'test model validation success': function () {
        this.stubs.axisYMaximumValue.returns({isValid: true, value: {}});
        this.stubs.axisYMinimumValue.returns({isValid: true, value: {}});
        this.stubs.axisYRange.returns({isValid: true, value: {}});
        this.stubs.axisYGridStep.returns({isValid: true, value: {}});
        this.stubs.colors.returns({});
        this.stubs.interactiveStep.returns({isValid: true, isInteractive: true, interactiveStep: {}});
        this.stubs.data.returns({isValid: true, value: {barsCount: {}, validRows: {}, parsedData: {}}});
        this.stubs.axisXBars.returns({isValid: true, value: {showXAxisBarsDescriptions: {}, axisXBarsDescriptions: {}}});
        this.stubs.axisXSeries.returns({isValid: true, value: {showXAxisSeriesDescriptions: {}, axisXSeriesDescriptions: {}}});
        this.stubs.answers.returns({isValid: true, answers: {}});
        this.stubs.results.returns({});
        this.stubs.axisYValues.returns({isValid: true, fixedValues: {}, cyclicValues: {}});

        var validationResult = this.presenter.validateModel({});

        assertTrue(validationResult.isValid);
        assertUndefined("fail", validationResult.errorCode);

        assertTrue(this.stubs.axisYMaximumValue.called);
        assertTrue(this.stubs.axisYMinimumValue.called);
        assertTrue(this.stubs.axisYRange.called);
        assertTrue(this.stubs.axisYGridStep.called);
        assertTrue(this.stubs.interactiveStep.called);
        assertTrue(this.stubs.colors.called);
        assertTrue(this.stubs.data.called);
        assertTrue(this.stubs.axisXBars.called);
        assertTrue(this.stubs.axisXSeries.called);
        assertTrue(this.stubs.answers.called);
        assertTrue(this.stubs.results.called);
        assertTrue(this.stubs.axisYValues.called);
    }
});
TestCase("Model Validation Tests", {

    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.model = {
            'Min' : '-5',
            'Max' : '5',
            'Ranges' : '<0, 1), 1\n' +
                       '(0, 5>, 0',
            'Step' : 1,
            'Axis X Values' : '1, 2, 3, 4, 5'
        }
    },

    'test min value is empty': function() {
        this.model['Min'] = '';

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'MIN01', configuration.errorCode);
    },

    'test min value is proper': function() {

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', -5, configuration.min);
    },

    'test max value is empty': function() {
        this.model['Max'] = '';

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'MAX01', configuration.errorCode);
    },

    'test max value is proper': function() {

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', 5, configuration.max);
    },

    'test max value is lower than min value': function() {
        this.model['Max'] = '-6';

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'MIN/MAX01', configuration.errorCode);
    },

    'test min value is lower than max value': function() {

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', -5, configuration.min);
        assertEquals('', 5, configuration.max);
    },

    'test ranges are proper set': function() {

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', 1, configuration.shouldDrawRanges.length);

        assertEquals('', 0, configuration.shouldDrawRanges[0].start.value);
        assertEquals('', 1, configuration.shouldDrawRanges[0].end.value);
        assertTrue('', configuration.shouldDrawRanges[0].start.include);
        assertFalse('', configuration.shouldDrawRanges[0].end.include);
    },

    'test step value is proper': function() {

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', 1, configuration.step);
    },

    'test step value is NOT valid': function() {
        this.model['Step'] = -1;
        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'STEP01', configuration.errorCode);
    },

    'test X axis values are set properly': function() {
        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertEquals('', 5, configuration.axisXValues.length);
        assertEquals('', [1, 2, 3, 4, 5], configuration.axisXValues);
    },

    'test X axis values are invalid': function() {
        this.model['Axis X Values'] = "1, 'a', 'b'";

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'VAL01', configuration.errorCode);
    },

    'test X axis values are out of range': function() {
        this.model['Axis X Values'] = "-6, 15, 18";

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'VAL01', configuration.errorCode);
    }
});
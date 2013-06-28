TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.model = {
            'Min' : '-5',
            'Max' : '5',
            'Ranges' : '<0; 1); 1\n' +
                       '(0; 5>; 0',
            'Step' : 1,
            'Axis X Values' : '1; 2; 3; 4; 5',
            'Is Visible': 'True'
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

        assertTrue(configuration.isVisibleByDefault);
        assertTrue(configuration.isCurrentlyVisible);

        assertTrue(configuration.isActivity);
        assertFalse(configuration.isDisabled);
        assertFalse(configuration.isDisabledByDefault);
    },

    'test module not in activity mode': function() {
        this.model['Not Activity'] = 'True';

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse('', configuration.isError);
        assertFalse(configuration.isActivity);
    },

    'test module is disabled by default': function() {
        this.model['Disable'] = 'True';

        var configuration = this.presenter.readConfiguration(this.model);

        assertFalse(configuration.isError);
        assertTrue(configuration.isDisabled);
        assertTrue(configuration.isDisabledByDefault);
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
        this.model['Axis X Values'] = "1; 'a'; 'b'";

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'VAL02', configuration.errorCode);
    },

    'test X axis values are out of range': function() {
        this.model['Axis X Values'] = "-6; 15; 18";

        var configuration = this.presenter.readConfiguration(this.model);

        assertTrue('', configuration.isError);
        assertEquals('', 'VAL01', configuration.errorCode);
    }
});

TestCase("Model validation - ranges", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'test proper ranges': function () {
        var validatedRanges = this.presenter.validateRanges('<0; 1); 1\n(0; 5>; 0');

        assertFalse(validatedRanges.isError);

        assertEquals(1, validatedRanges.shouldDrawRanges.length);
        assertEquals(0, validatedRanges.shouldDrawRanges[0].start.value);
        assertTrue(validatedRanges.shouldDrawRanges[0].start.include);
        assertEquals(1, validatedRanges.shouldDrawRanges[0].end.value);
        assertFalse(validatedRanges.shouldDrawRanges[0].end.include);

        assertEquals(1, validatedRanges.otherRanges.length);
        assertEquals(0, validatedRanges.otherRanges[0].start.value);
        assertFalse(validatedRanges.otherRanges[0].start.include);
        assertEquals(5, validatedRanges.otherRanges[0].end.value);
        assertTrue(validatedRanges.otherRanges[0].end.include);
    },

    'test single range that should be drawn': function () {
        var validatedRanges = this.presenter.validateRanges('<0; 1); 1');

        assertFalse('', validatedRanges.isError);

        assertEquals(1, validatedRanges.shouldDrawRanges.length);
        assertEquals(0, validatedRanges.shouldDrawRanges[0].start.value);
        assertTrue(validatedRanges.shouldDrawRanges[0].start.include);
        assertEquals(1, validatedRanges.shouldDrawRanges[0].end.value);
        assertFalse(validatedRanges.shouldDrawRanges[0].end.include);

        assertEquals(0, validatedRanges.otherRanges.length);
    },

    'test single range that should not be drawn': function () {
        var validatedRanges = this.presenter.validateRanges('(0; 5>; 0');

        assertFalse('', validatedRanges.isError);

        assertEquals(0, validatedRanges.shouldDrawRanges.length);

        assertEquals(1, validatedRanges.otherRanges.length);
        assertEquals(0, validatedRanges.otherRanges[0].start.value);
        assertFalse(validatedRanges.otherRanges[0].start.include);
        assertEquals(5, validatedRanges.otherRanges[0].end.value);
        assertTrue(validatedRanges.otherRanges[0].end.include);
    },

    'test missing opening bracket': function () {
        var validatedRanges = this.presenter.validateRanges('0; 5>; 0');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test missing closing bracket': function () {
        var validatedRanges = this.presenter.validateRanges('(0; 5; 0');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test missing comma separator': function () {
        var validatedRanges = this.presenter.validateRanges('(0 5>; 0');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test missing visibility': function () {
        var validatedRanges = this.presenter.validateRanges('(0; 5>');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test invalid range start': function () {
        var validatedRanges = this.presenter.validateRanges('(kaka; 5>;1');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test invalid range end': function () {
        var validatedRanges = this.presenter.validateRanges('(5; kaka>;1');

        assertTrue(validatedRanges.isError);
        assertEquals('RAN01', validatedRanges.errorCode);
    },

    'test range start is bigger than end': function () {
        var validatedRanges = this.presenter.validateRanges('(5; 3>;1');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    },

    'test range start with infinity sign': function () {
        var validatedRanges = this.presenter.validateRanges('<-INF; 5>; 0');

        assertFalse(validatedRanges.isError);

        assertEquals(0, validatedRanges.shouldDrawRanges.length);

        assertEquals(1, validatedRanges.otherRanges.length);
        assertEquals(-Infinity, validatedRanges.otherRanges[0].start.value);
        assertTrue(validatedRanges.otherRanges[0].start.include);
        assertEquals(5, validatedRanges.otherRanges[0].end.value);
        assertTrue(validatedRanges.otherRanges[0].end.include);
    },

    'test range ends with infinity sign': function () {
        var validatedRanges = this.presenter.validateRanges('<0; INF>; 0');

        assertFalse(validatedRanges.isError);

        assertEquals(0, validatedRanges.shouldDrawRanges.length);

        assertEquals(1, validatedRanges.otherRanges.length);
        assertEquals(0, validatedRanges.otherRanges[0].start.value);
        assertTrue(validatedRanges.otherRanges[0].start.include);
        assertEquals(Infinity, validatedRanges.otherRanges[0].end.value);
        assertTrue(validatedRanges.otherRanges[0].end.include);
    },

    'test range starts and ends with infinity signs and have exclusions': function () {
        var validatedRanges = this.presenter.validateRanges('(-INF; INF); 0');

        assertFalse(validatedRanges.isError);

        assertEquals(0, validatedRanges.shouldDrawRanges.length);

        assertEquals(1, validatedRanges.otherRanges.length);
        assertEquals(-Infinity, validatedRanges.otherRanges[0].start.value);
        assertTrue(validatedRanges.otherRanges[0].start.include);
        assertEquals(Infinity, validatedRanges.otherRanges[0].end.value);
        assertTrue(validatedRanges.otherRanges[0].end.include);
    },

    'test invalid infinite range - positive infinity': function () {
        var validatedRanges = this.presenter.validateRanges('(INF; INF); 0');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    },

    'test invalid infinite range - negative infinity': function () {
        var validatedRanges = this.presenter.validateRanges('(-INF; -INF); 0');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    },

    'test invalid infinite range - positive infinity and number': function () {
        var validatedRanges = this.presenter.validateRanges('(INF; 5); 0');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    },

    'test invalid infinite range - negative infinity and number': function () {
        var validatedRanges = this.presenter.validateRanges('(5; -INF); 0');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    },

    'test negative infinity should not be range end': function () {
        var validatedRanges = this.presenter.validateRanges('(INF; -INF); 0');

        assertTrue(validatedRanges.isError);
        assertEquals('MIN/MAX01', validatedRanges.errorCode);
    }
});
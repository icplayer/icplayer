TestCase("[Line number] Model validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.model = {
            'Min' : '-5',
            'Max' : '5',
            'Ranges' : '<0; 1); 1\n' +
                       '(0; 5>; 0',
            'Step' : '1',
            'Axis X Values' : '1; 2; 3; 4; 5',
            'Is Visible': 'True'
        }
    },

    'test min value is empty': function() {
        this.model['Min'] = '';

        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals('', 'MIN01', configuration.errorCode);
    },

    'test min value is proper': function() {

        var configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(-5, configuration.min);
    },

    'test max value is empty': function() {
        this.model['Max'] = '';

        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals('', 'MAX01', configuration.errorCode);
    },

    'test max value is proper': function() {

        var configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals('', 5, configuration.max);
    },

    'test max value is lower than min value': function() {
        this.model['Max'] = '-6';

        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals('', 'MIN/MAX01', configuration.errorCode);
    },

    'test min value is lower than max value': function() {

        var configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals('', -5, configuration.min);
        assertEquals('', 5, configuration.max);
    },

    'test ranges are proper set': function() {

        var configuration = this.presenter.validateModel(this.model);

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

        var configuration = this.presenter.validateModel(this.model);

        assertFalse('', configuration.isError);
        assertFalse(configuration.isActivity);
    },

    'test module is disabled by default': function() {
        this.presenter.$view = $('');
        this.model['Disable'] = 'True';

        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isError);
        assertTrue(configuration.isDisabled);
        assertTrue(configuration.isDisabledByDefault);
    },

    'test step value is proper': function() {

        var configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals(1, configuration.step);
    },

    'test step value is NOT valid': function() {
        this.model['Step'] = '-1';
        var configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
        assertEquals('STEP01', configuration.errorCode);
    }
});

TestCase("[Line number] Model validation - ranges", {
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
    },

    'test is multiplication return true' : function () {
        var axisXValues = '2*';

        var result = this.presenter.isMultiplication(axisXValues);

        assertTrue(result);
    },

    'test is multiplication return false' : function () {
        var axisXValues = 'p**';

        var result = this.presenter.isMultiplication(axisXValues);

        assertFalse(result);
    }

});

TestCase("[Line number] Step property validation", {

    setUp: function () {
        this.presenter = AddonLine_Number_create();
    },

    'invalid 0 value': function () {
        var validationResult = this.presenter.validateStep({"Step": 0}, ".", 20);

        assertTrue(validationResult.isError);
        assertEquals("STEP03", validationResult.errorCode);
    }

});

TestCase("[Line number] Axis X values validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.addonConfiguration = {
            isDecimalSeparatorSet: false,
            decimalSeparator: "",
            max: 50,
            min: -25
        };
    },

    'test valid mixed values, cyclic & fixed': function () {
        var model = {"Axis X Values": "5; 2; 1; 10*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertTrue(validationResult.isValid);
        assertEquals([5, 2, 1], validationResult.value.fixedValues);
        assertEquals([10], validationResult.value.cyclicValues);
    },

    'test valid cyclic values, zero number': function () {
        var model = {"Axis X Values": "0*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertTrue(validationResult.isValid);
        assertEquals([1], validationResult.value.cyclicValues);
    },


    'test invalid cyclic values, negative numbers': function () {
        var model = {"Axis X Values": "-10*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_01", validationResult.errorCode);
    },

    'test invalid cyclic values, duplicates': function () {
        var model = {"Axis X Values": "10*; 1; 2; 10*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_05", validationResult.errorCode);
    },

    'test invalid fixed values, duplicates': function () {
        var model = {"Axis X Values": "10*; 1; 2; 2; 3*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_05", validationResult.errorCode);
    },

    'test invalid fixed values, lower than min value': function () {
        var model = {"Axis X Values": "10*; 1; 2; -30; 3*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_02", validationResult.errorCode);
    },

    'test invalid fixed values, greater than max value': function () {
        var model = {"Axis X Values": "10*; 1; 2; 130; 3*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_03", validationResult.errorCode);
    },

    'test invalid mixed values, strings, not a number': function () {
        var model = {"Axis X Values": "1sadf.ajhnvl82w3vawe0*; 1; 2; sadfj.as2y34av130123ljha; 3*"};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration);

        assertFalse(validationResult.isValid);
        assertEquals("AXV_04", validationResult.errorCode);
    },

    'test empty string': function() {
        var model = {"Axis X Values": ""};

        var validationResult = this.presenter.validateAxisXValues(model, this.addonConfiguration)
    }
});


TestCase("[Line number] Create axis X field values validation", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();

        this.inArray = function(element) {
            if (this.indexOf(element) == -1) {
                return false;
            }
            return true;
        };
    },

    'test int step, range contains 0, int max/min': function () {
        var expectedValues = [-10, -7, -4, -1, 0, 2, 5, 8];

        var result = this.presenter.createAxisXFieldValues(-10, 10, 3);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(8, result.length);
    },

    'test int step, range contains 0, float max/min': function () {
        var expectedValues = [-7.5, -4.5, -1.5, 0, 1.5, 4.5, 7.5, 10.5, 13.5];

        var result = this.presenter.createAxisXFieldValues(-7.5, 13.5, 3);

        assertArray(result);
        assertEquals(expectedValues.length, result.length);
        assertTrue(expectedValues.every(this.inArray, result));
    },

    'test float step, range contains 0, float max/min': function () {
        var expectedValues = [0, 2.5, 5.0, 7.5, 10, 12.5, -2.5, -5, -7.5];

        var result = this.presenter.createAxisXFieldValues(-7.5, 13.5, 2.5);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test float numbers, checking range edge values with 0 in range': function () {
        var expectedValues = [0, 2.5, 5.0, 7.5, 10, 12.5, 15, -2.5, -5, -7.5];

        var result = this.presenter.createAxisXFieldValues(-7.5, 15, 2.5);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test float numbers, checking range edge values without 0 in range, positive range': function () {
        var expectedValues = [3.5, 7, 10.5, 14, 17.5];

        var result = this.presenter.createAxisXFieldValues(3.5, 17.5, 3.5);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test float numbers, checking range edge values without 0 in range, negative range': function () {
        var expectedValues = [-4.2, -8.4, -12.6, -16.8, -21];

        var result = this.presenter.createAxisXFieldValues(-21, -4.2, 4.2);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test int numbers, checking range edge values without 0 in range, negative range': function () {
        var expectedValues = [-4, -8, -12, -16, -20];

        var result = this.presenter.createAxisXFieldValues(-20, -4, 4);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test int numbers, checking range edge values without 0 in range, positive range': function () {
        var expectedValues = [5, 10, 15, 20, 25];

        var result = this.presenter.createAxisXFieldValues(5, 25, 5);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test int numbers, checking range edge values with 0 in range': function () {
        var expectedValues = [0, 5, 10, 15, 20, 25, -5, -10, -15];

        var result = this.presenter.createAxisXFieldValues(-15, 25, 5);

        assertArray(result);
        assertTrue(expectedValues.every(this.inArray, result));
        assertEquals(expectedValues.length, result.length);
    },

    'test int step, range dont contains 0, float max/min': function () {
        var expectedValues = [10.6,15.6,20.6,25.6,30.6];

        var result = this.presenter.createAxisXFieldValues(10.6, 32.8, 5);

        assertArray(result);
        assertEquals(expectedValues, result);
        assertEquals(expectedValues.length, result.length);
    },

    'test float step, range dont contains 0, float max/min': function () {
        var expectedValues = [10.6, 16.1, 21.6, 27.1, 32.6];

        var result = this.presenter.createAxisXFieldValues(10.6, 32.8, 5.5);

        assertArray(result);
        assertEquals(expectedValues.length, result.length);
        assertEquals(expectedValues, result);
    },

    'test float step, range below 0, float max/min': function () {
        var expectedValues = [-32.6, -27.1, -21.6, -16.1, -10.6];

        var result = this.presenter.createAxisXFieldValues(-32.6, -10, 5.5);

        assertArray(result);
        assertEquals(expectedValues.length, result.length);
        assertEquals(expectedValues, result);
    }
});

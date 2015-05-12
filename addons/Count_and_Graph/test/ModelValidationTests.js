TestCase("[Count_and_Graph] Axis Y maximum value validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test parsing proper value': function () {
        var validateIntResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "5"});
        var validateTwoDigitIntResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "15"});
        var validateOneResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "1"});

        assertTrue(validateIntResult.isValid);
        assertEquals(5, validateIntResult.value);
        assertFalse(validateIntResult.wasFloat);

        assertTrue(validateTwoDigitIntResult.isValid);
        assertEquals(15, validateTwoDigitIntResult.value);
        assertFalse(validateTwoDigitIntResult.wasFloat);

        assertTrue(validateOneResult.isValid);
        assertEquals(1, validateOneResult.value);
        assertFalse(validateOneResult.wasFloat);
    },

    'test parsing float to proper value': function () {
        var validateFloat = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "12.5432"});

        assertTrue(validateFloat.isValid);
        assertEquals(12, validateFloat.value);
        assertTrue(validateFloat.wasFloat);
    },

    'test value cant be lower or equal than 0': function () {
        var validateZeroResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "0"});
        var validateNegativeIntResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "-5"});
        var validateNegativeFloatResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "-1.5"});

        assertFalse(validateZeroResult.isValid);
        assertEquals("YAM_01", validateZeroResult.errorCode);


        assertFalse(validateNegativeIntResult.isValid);
        assertEquals("YAM_01", validateNegativeIntResult.errorCode);


        assertFalse(validateNegativeFloatResult.isValid);
        assertEquals("YAM_01", validateNegativeFloatResult.errorCode);
    },

    'test value cant be empty string': function () {
        var validationResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": ""});

        assertFalse(validationResult.isValid);
        assertEquals("YAM_02", validationResult.errorCode);
    },

    'test value cant be a non digit string': function () {
        var validateSimpleStringResult = this.presenter.validateAxisYMaximumValue({"Y axis maximum value": "alkjsdhjfaq8w34"});

        var validateStringResult = this.presenter.validateAxisYMaximumValue(
            {"Y axis maximum value": ";12o378132p; jsfDadsfl'a=1-24e sdadl 'fa ksdfas"}
        );

        var validateWhiteSpacesStringResult = this.presenter.validateAxisYMaximumValue(
            {"Y axis maximum value": "   \n aslf.jhklfalw34qdsa afsd fadsa "}
        );

        assertFalse(validateSimpleStringResult.isValid);
        assertEquals("YAM_02", validateSimpleStringResult.errorCode);

        assertFalse(validateStringResult.isValid);
        assertEquals("YAM_02", validateStringResult.errorCode);

        assertFalse(validateWhiteSpacesStringResult.isValid);
        assertEquals("YAM_02", validateWhiteSpacesStringResult.errorCode);
    }
});

TestCase("[Count_and_Graph] Axis Y values validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test valid fixed values': function () {
        var fixedValues = {"Y axis values": "0; 1; 2; 4; 10"};
        var fixedFloatValues = {"Y axis values": "0; 1; 2.43; 4.33; 10"};

        var validationResult = this.presenter.validateAxisYValues(fixedValues, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.cyclicValue);
        assertEquals([0, 1, 2, 4, 10], validationResult.fixedValues);
        assertEquals(5, validationResult.fixedValues.length);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(fixedFloatValues, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.cyclicValue);
        assertEquals([0, 1, 2, 4, 10], validationResult.fixedValues);
        assertEquals(5, validationResult.fixedValues.length);
        assertTrue(validationResult.wasFloat);
    },

    'test valid cyclic value': function () {
        var cyclicDigitOnlyValue = {"Y axis values": "3*"};
        var cyclicFloatValue = {"Y axis values": "3.4*"};
        var cyclicStringValue = {"Y axis values": "3asldfkjhao9w3yu34 adsfas gfs *"};
        var cyclicYMax = {"Y axis values": "10*"};

        var validationResult = this.presenter.validateAxisYValues(cyclicDigitOnlyValue, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertEquals(1, validationResult.cyclicValue.length);
        assertEquals([3], validationResult.cyclicValue);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(cyclicStringValue, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertEquals(1, validationResult.cyclicValue.length);
        assertEquals([3], validationResult.cyclicValue);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(cyclicYMax, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertEquals(1, validationResult.cyclicValue.length);
        assertEquals([10], validationResult.cyclicValue);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(cyclicFloatValue, 10);
        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertEquals(1, validationResult.cyclicValue.length);
        assertEquals([3], validationResult.cyclicValue);
        assertTrue(validationResult.wasFloat);
    },

    'test value cant be a non digit string or whitespaces': function () {
        var simpleString = {"Y axis values": "a;sdfj;ai23w4aefdas"};
        var whiteSpaceString = {"Y axis values": "  \n  qwerq1249up9ea jfvdlas;234 \b"};
        var complexString = {"Y axis values": "fd;aksa431#@!#_AQID\n sa/l mkl a [awir 239w ;wadf a'/;swap; [23w \n"};

        var validationResult = this.presenter.validateAxisYValues(simpleString, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_01", validationResult.errorCode);

        validationResult = this.presenter.validateAxisYValues(whiteSpaceString, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_01", validationResult.errorCode);

        validationResult = this.presenter.validateAxisYValues(complexString, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_01", validationResult.errorCode);
    },

    'test interpreting cyclic float number as integer float number': function () {
        var floatNumber = {"Y axis values": "3.5*"};

        var validationResult = this.presenter.validateAxisYValues(floatNumber, 10);

        assertTrue(validationResult.isValid);
        assertEquals(3, validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertTrue(validationResult.wasFloat);
    },

    'test empty string value parsed as cyclic value 1': function () {
        var emptyString = {"Y axis values": ""};

        var validationResult = this.presenter.validateAxisYValues(emptyString, 10);

        assertTrue(validationResult.isValid);
        assertEquals(1, validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertFalse(validationResult.wasFloat);
    },

    'test cyclic value cant be negative number': function () {
        var negativeCyclicValue = {"Y axis values": "-5*"};
        var negativeFloatCyclicValue = {"Y axis values": "-5.7*"};

        var validationResult = this.presenter.validateAxisYValues(negativeCyclicValue, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_02", validationResult.errorCode);

        validationResult = this.presenter.validateAxisYValues(negativeFloatCyclicValue, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_02", validationResult.errorCode);
    },

    'test cyclic value cant be zero number': function () {
        var zeroCyclicValue = {"Y axis values": "0*"};
        var parsingFloatCreatesZero = {"Y axis values": "0.53244*"};

        var validationResult = this.presenter.validateAxisYValues(zeroCyclicValue, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_02", validationResult.errorCode);

        validationResult = this.presenter.validateAxisYValues(parsingFloatCreatesZero, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_02", validationResult.errorCode);
    },

    'test fixed values cant be lower than 0': function () {
        var negativeFixedValues = {"Y axis values": "7; 8; -5; -123; -0.532"};

        var validationResult = this.presenter.validateAxisYValues(negativeFixedValues, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_03", validationResult.errorCode);
    },

    'test cyclic value is parsed by parseInt on string having last index char *': function () {
        var simpleProperValue = {"Y axis values": "5*"};
        var fixedValuesInFrontCyclicString = {"Y axis values": "1; 12; 15; 3*"};
        var fixedValuesInFrontStringEndedWithStar = {"Y axis values": "3.5; 4; 1; asefddkl;fjah38u23 pwey\nuy8 0po238u5w.f wqa *"};

        var validationResult = this.presenter.validateAxisYValues(simpleProperValue, 10);
        assertTrue(validationResult.isValid);
        assertEquals([5], validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(fixedValuesInFrontCyclicString, 10);
        assertTrue(validationResult.isValid);
        assertEquals([1], validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(fixedValuesInFrontStringEndedWithStar, 10);
        assertTrue(validationResult.isValid);
        assertEquals([3], validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertTrue(validationResult.wasFloat);
    },

    'test only one cyclic value, first correct is supported': function () {
        var twoCyclicValues = {"Y axis values": "2asfdsafdsa*; 1asfdas*"};

        var validationResult = this.presenter.validateAxisYValues(twoCyclicValues, 10);
        assertTrue(validationResult.isValid);
        assertEquals([2], validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertFalse(validationResult.wasFloat);
    },

    'test only cyclic valuse or fixed are supported': function () {
        var checkingCyclicValueOnly = {"Y axis values": "2; 8; -5; -123; -0.532*"};
        var onlyFixedValues = {"Y axis values": "2; 5; 6; 8"};

        var validationResult = this.presenter.validateAxisYValues(checkingCyclicValueOnly, 10);
        assertTrue(validationResult.isValid);
        assertEquals([2], validationResult.cyclicValue);
        assertUndefined(validationResult.fixedValues);
        assertFalse(validationResult.wasFloat);

        validationResult = this.presenter.validateAxisYValues(onlyFixedValues, 10);
        assertTrue(validationResult.isValid);
        assertEquals([2, 5, 6, 8], validationResult.fixedValues);
        assertUndefined(validationResult.cyclicValue);
        assertFalse(validationResult.wasFloat);
    },

    'test values cant be larger than Y max': function () {
        var cyclicValue = {"Y axis values": "12*"};
        var fixedValues = {"Y axis values": "2; 3; 4; 12; 5"};

        var validationResult = this.presenter.validateAxisYValues(cyclicValue, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_04", validationResult.errorCode);

        validationResult = this.presenter.validateAxisYValues(fixedValues, 10);
        assertFalse(validationResult.isValid);
        assertEquals("YAV_04", validationResult.errorCode);
    }
});

TestCase("[Count_and_Graph] Bars width validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test valid float user input': function () {
        var validationResult = this.presenter.validateBarsWidth({"Bars width": "15.5"});
        assertTrue(validationResult.isValid);
        assertEquals(15.5, validationResult.value);

        validationResult = this.presenter.validateBarsWidth({"Bars width": "5"});
        assertTrue(validationResult.isValid);
        assertEquals(5, validationResult.value);
    },

    'test value cant be negative number': function () {
        var validationResult = this.presenter.validateBarsWidth({"Bars width": "-15.5"});
        assertFalse(validationResult.isValid);
        assertEquals("BW_01", validationResult.errorCode);

        validationResult = this.presenter.validateBarsWidth({"Bars width": "-0.0000123"});
        assertFalse(validationResult.isValid);
        assertEquals("BW_01", validationResult.errorCode);

        validationResult = this.presenter.validateBarsWidth({"Bars width": "-3"});
        assertFalse(validationResult.isValid);
        assertEquals("BW_01", validationResult.errorCode);
    },

    'test value cant be a non digit string': function () {
        var stringValue = {"Bars width": "lsjkfa4324"};
        var whiteSpaceStringValue = {"Bars width": "       \n         asd134 1lsjkfa4324"};

        var validationResult = this.presenter.validateBarsWidth(stringValue);
        assertFalse(validationResult.isValid);
        assertEquals("BW_02", validationResult.errorCode);

        validationResult = this.presenter.validateBarsWidth(whiteSpaceStringValue);
        assertFalse(validationResult.isValid);
        assertEquals("BW_02", validationResult.errorCode);
    },

    'test parsing value betwen 0-1 to 1': function () {
        var zeroValue = {"Bars width": "0"};
        var aBitGreaterThanZero = {"Bars width": "0.012312"};

        var validationResult = this.presenter.validateBarsWidth(zeroValue);
        assertTrue(validationResult.isValid);
        assertEquals(1, validationResult.value);

        validationResult = this.presenter.validateBarsWidth(aBitGreaterThanZero);
        assertTrue(validationResult.isValid);
        assertEquals(1, validationResult.value);
    },

    'test valid parsing string with chars behind digits': function () {
        var digitsWithString = {"Bars width": "12asdfj;a3542w "};
        var floatDigitsWithString = {"Bars width": "5.75lsjkfa4324"};

        var validationResult = this.presenter.validateBarsWidth(digitsWithString);
        assertTrue(validationResult.isValid);
        assertEquals(12, validationResult.value);

        validationResult = this.presenter.validateBarsWidth(floatDigitsWithString);
        assertTrue(validationResult.isValid);
        assertEquals(5.75, validationResult.value);
    }
});

TestCase("[Count_and_Graph] Background color validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test user input is proper #RGB value': function () {
        var validationResult = this.presenter.validateBackgroundColor({"Background color": "#aa2233"});

        assertTrue(validationResult.isValid);
        assertEquals("#aa2233", validationResult.value);
    },

    'test user input is not proper #RGB value': function () {
        var lettersNotProper = {"Background color": "#q2w3m"};
        var whitespaces = {"Background color": "#   aa2233"};


        var validationResult = this.presenter.validateBackgroundColor(lettersNotProper);
        assertFalse(validationResult.isValid);
        assertEquals("BC_01", validationResult.errorCode);

        validationResult = this.presenter.validateBackgroundColor(whitespaces);
        assertFalse(validationResult.isValid);
        assertEquals("BC_01", validationResult.errorCode);
    }
});

TestCase("[Count_and_Graph] Grid line color validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test user input is proper #RGB value': function () {
        var validationResult = this.presenter.validateGridLineColor({"Grid line color": "#aa2233"});

        assertTrue(validationResult.isValid);
        assertEquals("#aa2233", validationResult.value);
    },

    'test user input is not proper #RGB value': function () {
        var lettersNotProper = {"Grid line color": "#q2w3m"};
        var whitespaces = {"Grid line color": "#   aa2233"};


        validationResult = this.presenter.validateGridLineColor(lettersNotProper);
        assertFalse(validationResult.isValid);
        assertEquals("GLC_01", validationResult.errorCode);

        validationResult = this.presenter.validateGridLineColor(whitespaces);
        assertFalse(validationResult.isValid);
        assertEquals("GLC_01", validationResult.errorCode);
    }
});

TestCase("[Count_and_Graph] Border validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test valid user input': function () {
        var intBorder = {Border: "5"};
        var floatBorder = {Border: "10.33"};
        var numberWithStringsBehind = {Border: "5afsdnlaw834lafdhjsafdsa"};

        var validationResult = this.presenter.validateBorder(intBorder);
        assertTrue(validationResult.isValid);
        assertEquals(5, validationResult.value);

        validationResult = this.presenter.validateBorder(floatBorder);
        assertTrue(validationResult.isValid);
        assertEquals(10.33, validationResult.value);

        validationResult = this.presenter.validateBorder(numberWithStringsBehind);
        assertTrue(validationResult.isValid);
        assertEquals(5, validationResult.value);
    },

    'test negative numbers are ignored and change nothing, parsed as 0': function () {
        var negativeIntBorder = {Border: "-3"};
        var negativeFloatBorder = {Border: "-0.45"};

        var validationResult = this.presenter.validateBorder(negativeIntBorder);
        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);

        validationResult = this.presenter.validateBorder(negativeFloatBorder);
        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    },

    'test non numbers strings are ignored and parsed as 0': function () {
        var simpleString = {Border: "as;lfdkja;l432u8;eafjl;sdaf"};
        var whiteSpacesString = {Border: "      \n         \b alwuiyrl327y6rlfhajefljfdsafdsa"};

        var validationResult = this.presenter.validateBorder(simpleString);
        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);

        validationResult = this.presenter.validateBorder(whiteSpacesString);
        assertTrue(validationResult.isValid);
        assertEquals(0, validationResult.value);
    }
});

TestCase("[Count_and_Graph] Axis X data validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.model = {
            "X axis data": [
                {"Answer": "1", "Color": "red", "Description": "1", "Description image": "1"},
                {"Answer": "2", "Color": "blue", "Description": "2", "Description image": "2"},
                {"Answer": "3", "Color": "green", "Description": "3", "Description image": "3"},
                {"Answer": "4", "Color": "brown", "Description": "4", "Description image": "4"}
            ]
        };
    },

    'test correct parsing of data': function () {
        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertTrue(validationResult.isValid);
        assertFalse(validationResult.answersBeyondAxisRange);
        assertFalse(validationResult.wasFloat);
        assertEquals([1, 2, 3, 4], validationResult.answers);
        assertEquals(["red", "blue", "green", "brown"], validationResult.colors);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptions);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptionsImages);
        assertEquals(4, validationResult.columnsNumber);
    },

    'test answers cant be empty string': function () {
        this.model["X axis data"][0]["Answer"] = "";
        this.model["X axis data"][3]["Answer"] = "";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertFalse(validationResult.isValid);
        assertEquals("AXD_01", validationResult.errorCode);
    },

    'test answers cant be a string': function () {
        this.model["X axis data"][3]["Answer"] = "asfd;ja;34u2;afekjdasfcsa";
        this.model["X axis data"][2]["Answer"] = "        \b            \n         asfd;ja;34u2;afekjdasfcsa";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertFalse(validationResult.isValid);
        assertEquals("AXD_02", validationResult.errorCode);
    },

    'test answers cant be a digits with chars behind it': function () {
        this.model["X axis data"][3]["Answer"] = "123333csa";
        this.model["X axis data"][2]["Answer"] = "8asfda";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertFalse(validationResult.isValid);
        assertEquals("AXD_02", validationResult.errorCode);
    },

    'test answers which are beyond Axis Y range, should provide apropriate statement': function () {
        this.model["X axis data"][3]["Answer"] = "15";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertTrue(validationResult.isValid);
        assertTrue(validationResult.answersBeyondAxisRange);
        assertFalse(validationResult.wasFloat);
        assertEquals([1, 2, 3, 15], validationResult.answers);
        assertEquals(["red", "blue", "green", "brown"], validationResult.colors);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptions);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptionsImages);
        assertEquals(4, validationResult.columnsNumber);
    },

    'test answers can be negative, but have to provide such information that are invalid': function () {
        this.model["X axis data"][3]["Answer"] = "-5";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertTrue(validationResult.isValid);
        assertTrue(validationResult.answersBeyondAxisRange);
        assertFalse(validationResult.wasFloat);
        assertEquals([1, 2, 3, -5], validationResult.answers);
        assertEquals(["red", "blue", "green", "brown"], validationResult.colors);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptions);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptionsImages);
        assertEquals(4, validationResult.columnsNumber);
    },

    'test validation should detect if answers was float and parse them to int': function () {
        this.model["X axis data"][3]["Answer"] = "2.35443";
        this.model["X axis data"][1]["Answer"] = "5.44";

        var validationResult = this.presenter.validateAxisXData(this.model, 10);

        assertTrue(validationResult.isValid);
        assertFalse(validationResult.answersBeyondAxisRange);
        assertTrue(validationResult.wasFloat);
        assertEquals([1, 5, 3, 2], validationResult.answers);
        assertEquals(["red", "blue", "green", "brown"], validationResult.colors);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptions);
        assertEquals(["1", "2", "3", "4"], validationResult.descriptionsImages);
        assertEquals(4, validationResult.columnsNumber);
    }
});

TestCase("[Count_and_Graph] Model validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.stubs = {
            validateAxisYMaximumValue: sinon.stub(this.presenter, 'validateAxisYMaximumValue'),
            validateAxisYValues: sinon.stub(this.presenter, 'validateAxisYValues'),
            validateBarsWidth: sinon.stub(this.presenter, 'validateBarsWidth'),
            validateBackgroundColor: sinon.stub(this.presenter, 'validateBackgroundColor'),
            validateGridLineColor: sinon.stub(this.presenter, 'validateGridLineColor'),
            validateBorder: sinon.stub(this.presenter, 'validateBorder'),
            validateAxisXData: sinon.stub(this.presenter, 'validateAxisXData')
        };
    },

    tearDown: function () {
        this.presenter.validateAxisYMaximumValue.restore();
        this.presenter.validateAxisYValues.restore();
        this.presenter.validateBarsWidth.restore();
        this.presenter.validateBackgroundColor.restore();
        this.presenter.validateGridLineColor.restore();
        this.presenter.validateBorder.restore();
        this.presenter.validateAxisXData.restore();
    },

    'test failed axis y maximum validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: false, errorCode: "axisYMaxFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("axisYMaxFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);

        assertFalse(this.stubs.validateAxisYValues.called);
        assertFalse(this.stubs.validateBarsWidth.called);
        assertFalse(this.stubs.validateBackgroundColor.called);
        assertFalse(this.stubs.validateGridLineColor.called);
        assertFalse(this.stubs.validateBorder.called);
        assertFalse(this.stubs.validateAxisXData.called);
    },

    'test failed axis y values validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10});
        this.stubs.validateAxisYValues.returns({isValid: false, errorCode: "axisYValuesFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("axisYValuesFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);

        assertFalse(this.stubs.validateBarsWidth.called);
        assertFalse(this.stubs.validateBackgroundColor.called);
        assertFalse(this.stubs.validateGridLineColor.called);
        assertFalse(this.stubs.validateBorder.called);
        assertFalse(this.stubs.validateAxisXData.called);
    },

    'test failed bars width validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: false, cyclicValue: [1]});
        this.stubs.validateBarsWidth.returns({isValid: false, errorCode: "barsWidthFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("barsWidthFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);

        assertFalse(this.stubs.validateBackgroundColor.called);
        assertFalse(this.stubs.validateGridLineColor.called);
        assertFalse(this.stubs.validateBorder.called);
        assertFalse(this.stubs.validateAxisXData.called);
    },

    'test failed background color validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: false, cyclicValue: [1]});
        this.stubs.validateBarsWidth.returns({isValid: true, value: 1});
        this.stubs.validateBackgroundColor.returns({isValid: false, errorCode: "backgroundColorFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("backgroundColorFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);
        assertTrue(this.stubs.validateBackgroundColor.called);

        assertFalse(this.stubs.validateGridLineColor.called);
        assertFalse(this.stubs.validateBorder.called);
        assertFalse(this.stubs.validateAxisXData.called);
    },

    'test failed grid line color validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: false, cyclicValue: [1]});
        this.stubs.validateBarsWidth.returns({isValid: true, value: 1});
        this.stubs.validateBackgroundColor.returns({isValid: true, value: "red"});
        this.stubs.validateGridLineColor.returns({isValid: false, errorCode: "gridLineColorFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("gridLineColorFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);
        assertTrue(this.stubs.validateBackgroundColor.called);
        assertTrue(this.stubs.validateGridLineColor.called);

        assertFalse(this.stubs.validateBorder.called);
        assertFalse(this.stubs.validateAxisXData.called);
    },

    'test failed axis x data validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: false, cyclicValue: [1]});
        this.stubs.validateBarsWidth.returns({isValid: true, value: 1});
        this.stubs.validateBackgroundColor.returns({isValid: true, value: "red"});
        this.stubs.validateGridLineColor.returns({isValid: true, value: "blue"});
        this.stubs.validateBorder.returns({isValid: true, value: 1});
        this.stubs.validateAxisXData.returns({isValid: false, errorCode: "axisXDataFailure"});

        var validationResult = this.presenter.validateModel({});

        assertFalse(validationResult.isValid);
        assertEquals("axisXDataFailure", validationResult.errorCode);

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);
        assertTrue(this.stubs.validateBackgroundColor.called);
        assertTrue(this.stubs.validateGridLineColor.called);
        assertTrue(this.stubs.validateBorder.called);
        assertTrue(this.stubs.validateAxisXData.called);
    },

    'test model without floats, with cyclic value axis Y values validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10, wasFloat: false});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: false, cyclicValue: [1]});
        this.stubs.validateBarsWidth.returns({isValid: true, value: 1});
        this.stubs.validateBackgroundColor.returns({isValid: true, value: "red"});
        this.stubs.validateGridLineColor.returns({isValid: true, value: "blue"});
        this.stubs.validateBorder.returns({isValid: true, value: 1});

        this.stubs.validateAxisXData.returns({
            isValid: true,
            wasFloat: false,
            answersBeyondAxisRange: false,
            answers: [1, 2, 3],
            colors: ["red", "green", "blue"],
            descriptions: ["1", "2", "3"],
            descriptionsImages: ["1", "2", "3"],
            columnsNumber: 3
        });

        var validationResult = this.presenter.validateModel({});

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);
        assertTrue(this.stubs.validateBackgroundColor.called);
        assertTrue(this.stubs.validateGridLineColor.called);
        assertTrue(this.stubs.validateBorder.called);
        assertTrue(this.stubs.validateAxisXData.called);

        assertTrue(validationResult.isValid);
        assertEquals(10, validationResult.axisYMaximumValue);
        assertFalse(validationResult.wasFloat.axisYMaximumValue);

        assertEquals(1, validationResult.axisYValues.cyclicValue);
        assertUndefined(1, validationResult.axisYValues.fixedValues);
        assertFalse(validationResult.wasFloat.axisYValues);

        assertEquals(1, validationResult.barsWidth);
        assertEquals("red", validationResult.backgroundColor);
        assertEquals("blue", validationResult.gridLineColor);
        assertEquals(1, validationResult.border);

        assertFalse(validationResult.wasFloat.axisXData);
        assertFalse(validationResult.answersBeyondAxisRange);
        assertEquals([1, 2, 3], validationResult.answers);
        assertEquals(["red", "green", "blue"], validationResult.columnsColors);
        assertEquals(["1", "2", "3"], validationResult.columnsDescriptions);
        assertEquals(["1", "2", "3"], validationResult.columnsDescriptionsImages);
        assertEquals(3, validationResult.columnsNumber);
    },

    'test model with floats, with fixed values axis Y values, with answers beyond Y axis scope, validation': function () {
        this.stubs.validateAxisYMaximumValue.returns({isValid: true, value: 10, wasFloat: true});
        this.stubs.validateAxisYValues.returns({isValid: true, wasFloat: true, fixedValues: [1, 2, 3]});
        this.stubs.validateBarsWidth.returns({isValid: true, value: 1});
        this.stubs.validateBackgroundColor.returns({isValid: true, value: "red"});
        this.stubs.validateGridLineColor.returns({isValid: true, value: "blue"});
        this.stubs.validateBorder.returns({isValid: true, value: 1});

        this.stubs.validateAxisXData.returns({
            isValid: true,
            wasFloat: true,
            answersBeyondAxisRange: true,
            answers: [1, 2, 3],
            colors: ["red", "green", "blue"],
            descriptions: ["1", "2", "3"],
            descriptionsImages: ["1", "2", "3"],
            columnsNumber: 3
        });

        var validationResult = this.presenter.validateModel({});

        assertTrue(this.stubs.validateAxisYMaximumValue.called);
        assertTrue(this.stubs.validateAxisYValues.called);
        assertTrue(this.stubs.validateBarsWidth.called);
        assertTrue(this.stubs.validateBackgroundColor.called);
        assertTrue(this.stubs.validateGridLineColor.called);
        assertTrue(this.stubs.validateBorder.called);
        assertTrue(this.stubs.validateAxisXData.called);

        assertTrue(validationResult.isValid);
        assertEquals(10, validationResult.axisYMaximumValue);

        assertUndefined(validationResult.axisYValues.cyclicValue);
        assertEquals([1, 2, 3], validationResult.axisYValues.fixedValues);

        assertEquals(1, validationResult.barsWidth);
        assertEquals("red", validationResult.backgroundColor);
        assertEquals("blue", validationResult.gridLineColor);
        assertEquals(1, validationResult.border);

        assertTrue(validationResult.answersBeyondAxisRange);
        assertEquals([1, 2, 3], validationResult.answers);
        assertEquals(["red", "green", "blue"], validationResult.columnsColors);
        assertEquals(["1", "2", "3"], validationResult.columnsDescriptions);
        assertEquals(["1", "2", "3"], validationResult.columnsDescriptionsImages);
        assertTrue(validationResult.wasFloat.axisXData);

        assertTrue(validationResult.wasFloat.axisYValues);
        assertTrue(validationResult.wasFloat.axisYMaximumValue);
        assertEquals(3, validationResult.columnsNumber);
    }
});

TestCase("[Graph] Model validation", {
    /*
    *   This is oryginal Model Validation test. Do not change it, it ensures the backward compatibility of graph Addon,
    *   which uses invalid functions and logical situations. Issues description in presenter.
    * */
    setUp: function () {
        this.presenter = Addongraph_create();

        this.additionalSeriesColors =[
                {"Color": "red"},
                {"Color": "yellow"},
                {"Color": "blue"},
                {"Color": "green"}
            ];

        this.additionalShowXAxisSeriesDescriptions = "True";
        this.additionalXAxisBarsDescriptions = [
                {Description: "1"},
                {Description: "2"},
                {Description: "3"},
                {Description: "4"},
                {Description: "5"},
                {Description: "6"},
                {Description: "7"},
                {Description: "8"},
                {Description: "9"},
                {Description: "10"},
                {Description: "11"},
                {Description: "12"}
            ];


        this.additionalShowXAxisBarsDescriptions = "True";
        this.additionalXAxisSeriesDescriptions = [
                {Description: "1"},
                {Description: "2"},
                {Description: "3"}
            ];

        this.additionalAnswers = [
                {"Answer": "1"},
                {"Answer": "2"},
                {"Answer": "3"},
                {"Answer": "4"},
                {"Answer": "5"},
                {"Answer": "6"},
                {"Answer": "7"},
                {"Answer": "8"},
                {"Answer": "9"},
                {"Answer": "10"},
                {"Answer": "11"},
                {"Answer": "12"}
            ];

        this.additionalYAxisValues = "";
    },

    'test proper model': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10.5',
            'Y axis minimum value': '-10.5',
            'Y axis grid step': '2',
            'Interactive': 'True',
            'Interactive step': '2',
            'Data': '"1", "2", "3", "4"\n' +
                    '"2", "0", "-6", "-8"\n' +
                    '"20", "4", "6", "8"'
        };

        var expectedData = [
                [1, 2, 3, 4],
                [2, 0, -6, -8],
                [20, 4, 6, 8]
            ];

        // adding missing properties, for model to be properly validated
        model['Series colors'] = this.additionalSeriesColors;
        model['Show X axis series descriptions'] = this.additionalShowXAxisSeriesDescriptions;
        model['Show X axis bars descriptions'] = this.additionalShowXAxisBarsDescriptions;
        model['X axis bars descriptions'] = this.additionalXAxisBarsDescriptions;
        model['X axis series descriptions'] = this.additionalXAxisSeriesDescriptions;
        model['Answers'] = this.additionalAnswers;
        model['Y axis values'] = this.additionalYAxisValues;
        model['Y axis maximum value'] = '20.5';

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);

        assertEquals('graph1', validationResult.ID);

        assertEquals(expectedData, validationResult.data);

        assertEquals(-10.5, validationResult.axisYMinimumValue);
        assertEquals(20.5, validationResult.axisYMaximumValue);
        assertEquals(2, validationResult.axisYGridStep);

        assertTrue(validationResult.isInteractive);
        assertEquals(2, validationResult.interactiveStep);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.shouldCalcScore);

        assertFalse(validationResult.isDecimalSeparatorSet);
        assertUndefined(validationResult.decimalSeparator);

        // Mouse data
        assertFalse(validationResult.mouseData.isMouseDown);
        assertEquals(0, validationResult.mouseData.oldPosition.y);
        assertFalse(validationResult.mouseData.isMouseDragged);

    },

    'test decimal separator': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10,5',
            'Y axis minimum value': '-10,5',
            'Y axis grid step': '2,5',
            'Interactive': 'True',
            'Interactive step': '2,5',
            'Decimal separator': ",",
            'Data': '"1,5", "2", "3", "4"\n' +
                '"2", "0", "-6,5", "-8"\n' +
                '"20", "4,5", "6", "8"'
        },
            expectedData = [
                [1.5, 2, 3, 4],
                [2, 0, -6.5, -8],
                [20, 4.5, 6, 8]
            ];


        // adding missing properties, for model to be properly validated
        model['Series colors'] = this.additionalSeriesColors;
        model['Show X axis series descriptions'] = this.additionalShowXAxisSeriesDescriptions;
        model['Show X axis bars descriptions'] = this.additionalShowXAxisBarsDescriptions;
        model['X axis bars descriptions'] = this.additionalXAxisBarsDescriptions;
        model['X axis series descriptions'] = this.additionalXAxisSeriesDescriptions;
        model['Answers'] = this.additionalAnswers;
        model['Y axis values'] = this.additionalYAxisValues;
        model['Y axis maximum value'] = '20.5';

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);

        assertEquals('graph1', validationResult.ID);

        assertEquals(expectedData, validationResult.data);

        assertEquals(-10.5, validationResult.axisYMinimumValue);
        assertEquals(20.5, validationResult.axisYMaximumValue);
        assertEquals(2.5, validationResult.axisYGridStep);

        assertTrue(validationResult.isInteractive);
        assertEquals(2.5, validationResult.interactiveStep);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.shouldCalcScore);

        assertTrue(validationResult.isDecimalSeparatorSet);
        assertEquals(',', validationResult.decimalSeparator);
    },

    'test not in interactive mode': function () {
        var model = {
                'ID': 'graph1',
                'Is Visible': "True",
                'Y axis maximum value': '10.5',
                'Y axis minimum value': '-10.5',
                'Y axis grid step': '2.5',
                'Interactive': 'False',
                'Interactive step': '2.5',
                'Data': '"1.5", "2", "3", "4"\n' +
                    '"2", "0", "-6.5", "-8"\n' +
                    '"20", "4.5", "6", "8"'
            },
            expectedData = [
                [1.5, 2, 3, 4],
                [2, 0, -6.5, -8],
                [20, 4.5, 6, 8]
            ];


        // adding missing properties, for model to be properly validated
        model['Series colors'] = this.additionalSeriesColors;
        model['Show X axis series descriptions'] = this.additionalShowXAxisSeriesDescriptions;
        model['Show X axis bars descriptions'] = this.additionalShowXAxisBarsDescriptions;
        model['X axis bars descriptions'] = this.additionalXAxisBarsDescriptions;
        model['X axis series descriptions'] = this.additionalXAxisSeriesDescriptions;
        model['Answers'] = this.additionalAnswers;
        model['Y axis values'] = this.additionalYAxisValues;
        model['Y axis maximum value'] = '20.5';

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);

        assertEquals('graph1', validationResult.ID);

        assertEquals(expectedData, validationResult.data);

        assertEquals(-10.5, validationResult.axisYMinimumValue);
        assertEquals(20.5, validationResult.axisYMaximumValue);
        assertEquals(2.5, validationResult.axisYGridStep);

        assertFalse(validationResult.isInteractive);
        assertUndefined(validationResult.interactiveStep);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.shouldCalcScore);

        assertFalse(validationResult.isDecimalSeparatorSet);
        assertUndefined(validationResult.decimalSeparator);
    },

    'test Y axis maximum value invalid': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': 'nan',
            'Y axis minimum value': '-10.5',
            'Data': '"1", "2", "3", "4"\n' +
                '"2", "0", "-6", "-8"\n' +
                '"20", "4", "6", "8"'
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC', validationResult.errorCode);
    },

    'test Y axis minimum value invalid': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10.5',
            'Y axis minimum value': '-nan',
            'Data': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC', validationResult.errorCode);
    },

    'test Y axis does not include zero': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10',
            'Y axis minimum value': '5',
            'Data': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('AXIS_Y_DOES_NOT_INCLUDE_ZERO', validationResult.errorCode);
    },

    'test Y axis grid step value invalid': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10',
            'Y axis minimum value': '-5',
            'Y axis grid step': 'nan',
            'Data': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('AXIS_Y_GRID_STEP_NOT_NUMERIC', validationResult.errorCode);
    },

    'test interactive step value is invalid': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10',
            'Y axis minimum value': '-5',
            'Y axis grid step': '1',
            'Interactive': 'True',
            'Interactive step': 'nan',
            'Data': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('INTERACTIVE_STEP_NOT_NUMERIC', validationResult.errorCode);
    },

    'test interactive step value is valid number but lower than 1': function () {
        var model = {
            'ID': 'graph1',
            'Is Visible': "True",
            'Y axis maximum value': '10',
            'Y axis minimum value': '-5',
            'Y axis grid step': '1',
            'Interactive': 'True',
            'Interactive step': '0',
            'Data': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('INTERACTIVE_STEP_NOT_POSITIVE', validationResult.errorCode);
    }
});

TestCase("[Graph] Y axis values validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid only fixed position values': function () {
        var model = {"Y axis values": "1; 2; 3.5"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.cyclicValues);
        assertEquals([1, 2, 3.5], validationResult.fixedValues);
    },

    'test valid only cyclic position values': function () {
        var model = {"Y axis values": "1*; 3.5*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertEquals([1, 3.5], validationResult.cyclicValues);
    },

    'test valid values': function () {
        var model = {"Y axis values": "5; 6; 2.5*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertTrue(validationResult.isValid);
        assertEquals([5, 6], validationResult.fixedValues);
        assertEquals([2.5], validationResult.cyclicValues);
    },

    'test valid values with decimal separator set': function () {
        var model = {"Y axis values": "1; 12,5; 5*", "Decimal separator": ","};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, true);

        assertTrue(validationResult.isValid);
        assertEquals([1, 12.5], validationResult.fixedValues);
        assertEquals([5], validationResult.cyclicValues);
    },

    'test invalid values, digits with string mix': function () {
        var model = {"Y axis values": "1rewqrewqrewq; 12,5zxvcxzvcxz; 5asfd;asfda*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertUndefined(validationResult.cyclicValues);
        assertEquals("YAV_01", validationResult.errorCode);

        model = {"Y axis values": "sd./f,adj;liu32jf;dasfds;lkfjdsk;"};
        validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertUndefined(validationResult.cyclicValues);
        assertEquals("YAV_01", validationResult.errorCode);
    },

    'test invalid values, zero cyclic number': function () {
        var model = {"Y axis values": "0*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertUndefined(validationResult.fixedValues);
        assertUndefined(validationResult.cyclicValues);
        assertEquals("YAV_02", validationResult.errorCode);
    },

    'test valid value, zero fixed number': function () {
        var model = {"Y axis values": "0"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertTrue(validationResult.isValid);
        assertEquals([0], validationResult.fixedValues);
        assertUndefined(validationResult.cyclicValues);
    },

    'test invalid value, values greater than Y axis max': function () {
        var model = {"Y axis values": "1; 5; 20; 3*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertEquals("YAV_03", validationResult.errorCode);
        assertUndefined(validationResult.cyclicValues);
        assertUndefined(validationResult.fixedValues);

        model = {"Y axis values": "1; 5; 20*; 3*"};
        validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertEquals("YAV_03", validationResult.errorCode);
        assertUndefined(validationResult.cyclicValues);
        assertUndefined(validationResult.fixedValues);
    },

    'test invalid value, values lower than Y axis min': function () {
        var model = {"Y axis values": "1; 5; -20; 3*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertEquals("YAV_04", validationResult.errorCode);
        assertUndefined(validationResult.cyclicValues);
        assertUndefined(validationResult.fixedValues);
    },

    'test invalid value, negative cyclic values': function () {
        var model = {"Y axis values": "1; 5; -5; -3*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertEquals("YAV_05", validationResult.errorCode);
        assertUndefined(validationResult.cyclicValues);
        assertUndefined(validationResult.fixedValues);

    },

    'test invalid value, duplicates': function () {
        var model = {"Y axis values": "1; 5; -5; 3*; 1; 3*"};
        var validationResult = this.presenter.validateAxisYValues(model, 15, -15, false);

        assertFalse(validationResult.isValid);
        assertEquals("YAV_06", validationResult.errorCode);
        assertUndefined(validationResult.cyclicValues);
        assertUndefined(validationResult.fixedValues);

    }
});

TestCase("[Graph] Parse data", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid values': function () {
        var data = {
            'Data': '"1", "2", "3", "4"\n' +
                    '"2", "0", "-6", "-8"\n' +
                    '"20", "4", "6", "8"'
        };

        var expectedData = [
            [1, 2, 3, 4],
            [2, 0, -6, -8],
            [20, 4, 6, 8]
        ];

        var parsingResult = this.presenter.parseData(data, false, undefined);

        assertEquals(expectedData, parsingResult);
    },

    'test invalid values': function () {
        var data = { 'Data': '"1", "\n"'};

        var parsingResult = this.presenter.parseData(data, false, undefined);

        assertEquals([null, null], parsingResult);
    },

    'test valid values, with decimalSeparatorSet': function () {
        var data = {
            'Data': '"1", "2", "3,5", "4"\n' +
                    '"2", "0", "-6,9", "-8"\n' +
                    '"20", "4", "6,6", "8"'
        };

        var expectedData = [
            [1, 2, 3.5, 4],
            [2, 0, -6.9, -8],
            [20, 4, 6.6, 8]
        ];

        var parsingResult = this.presenter.parseData(data, true, ",");

        assertEquals(expectedData, parsingResult);
    },

    'test invalid values, with decimal separator set': function () {
        var data = { 'Data': '"1", "\n"'};

        var parsingResult = this.presenter.parseData(data, true, ",");

        assertEquals([null, null], parsingResult);
    }
});

TestCase("[Graph] Parse colors", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test parsing values': function () {
        var model = {
            "Series colors": [
                {Color: "grey"},
                {Color: "green"},
                {Color: "yellow"},
                {Color: "blue"}
            ]
        };

        var parsingResult = this.presenter.parseColors(model);
        assertEquals(["grey", "green", "yellow", "blue"], parsingResult);
    }
});

TestCase("[Graph] Data validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
        this.expectedData = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
    },

    'test valid data validation': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "9"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertTrue(validatedData.isValid);
        assertEquals(this.expectedData, validatedData.value.parsedData);
        assertEquals(9, validatedData.value.barsCount);
        assertEquals(3, validatedData.value.columnsCount);
    },

    'test valid data validation with invalid mix of strings behind digits': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2asdfafdsa", "3"\n' +
                    '"4", "5", "6qweafdzx"\n' +
                    '"7", "8", "9sdaflkjhewlq"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertTrue(validatedData.isValid);
        assertEquals(this.expectedData, validatedData.value.parsedData);
        assertEquals(9, validatedData.value.barsCount);
        assertEquals(3, validatedData.value.columnsCount);
    },

    'test invalid data, csv syntax error': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "\n", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "9"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("DATA_ROW_MALFORMED", validatedData.errorCode);
        assertEquals(1, validatedData.errorMessageSubstitutions.row);
    },

    'test invalid data, not enough columns': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2", "3"\n' +
                    '"4", "5"\n' +
                    '"7", "8", "9"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("DATA_ROW_DIFFERENT_COLUMNS_COUNT", validatedData.errorCode);
        assertEquals(2, validatedData.errorMessageSubstitutions.row);
    },

    'test invalid data, value not numeric': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "aqewadsfa2sdfasafdsa", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "9"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("DATA_ROW_VALUE_NOT_NUMERIC", validatedData.errorCode);
        assertEquals(1, validatedData.errorMessageSubstitutions.row);
        assertEquals(1, validatedData.errorMessageSubstitutions.column);
        assertEquals('aqewadsfa2sdfasafdsa', validatedData.errorMessageSubstitutions.value);
    },

    'test invalid data, values greater than axis Y max value': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "30"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("AXIS_Y_MAXIMUM_VALUE_TOO_SMALL", validatedData.errorCode);
        assertEquals(30, validatedData.errorMessageSubstitutions.value);
        assertEquals(20, validatedData.errorMessageSubstitutions.range);
    },

    'test invalid data, values lower than axis Y min value': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "-30"'
        };

        var graphConfiguration = {
            "Series colors": ["grey", "blue", "green"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("AXIS_Y_MINIMUM_VALUE_TOO_BIG", validatedData.errorCode);
        assertEquals(-30, validatedData.errorMessageSubstitutions.value);
        assertEquals(-20, validatedData.errorMessageSubstitutions.range);
    },

    'test invalid data, invalid amount of series colors': function () {
        var model = {
            'ID': 'graph1',
            'Data': '"1", "2", "3"\n' +
                    '"4", "5", "6"\n' +
                    '"7", "8", "9"'
        };

        var graphConfiguration = {
            "Series colors": ["grey"],
            "Axis x bars descriptions": ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            "Axis x series descriptions": ["seria1", "seria2", "seria3"],
            "axisYMaximumValue": 20,
            "axisYMinimumValue": -20
        };

        var validatedData = this.presenter.validateData(model, graphConfiguration);
        assertFalse(validatedData.isValid);
        assertEquals("SERIES_COLORS_AMOUNT_INVALID", validatedData.errorCode);
    }
});

TestCase("[Graph] Parse axis X bars descriptions", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test parsing xbars descriptions': function () {
        var model = {
            "X axis bars descriptions": [
                {"Description": "jeden"},
                {"Description": "dwa"},
                {"Description": "trzy"},
                {"Description": "cztery"},
                {"Description": "piec"}
            ]
        };
        var parsingResult = this.presenter.parseAxisXBarsDescriptions(model, true);

        assertEquals(["jeden", "dwa", "trzy", "cztery", "piec"], parsingResult);
    }
});

TestCase("[Graph] Parse axis X series descriptions", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test parsing xbars descriptions': function () {
        var model = {
            "X axis series descriptions": [
                {"Description": "jeden"},
                {"Description": "dwa"},
                {"Description": "trzy"},
                {"Description": "cztery"},
                {"Description": "piec"}
            ]
        };
        var parsingResult = this.presenter.parseAxisXSeriesDescriptions(model, true);

        assertEquals(["jeden", "dwa", "trzy", "cztery", "piec"], parsingResult);
    }
});

TestCase("[Graph] Axis X bars descriptions validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid descriptions amount': function () {
        var model = {
            'Show X axis bars descriptions': 'True',
            'X axis bars descriptions': [
                {"Description": "1"},
                {"Description": "2"},
                {"Description": "3"}
            ]
        };

        var validationResult = this.presenter.validateAxisXBarsDescriptions(model, 3);

        assertTrue(validationResult.isValid);
        assertEquals(["1", "2", "3"], validationResult.value.axisXBarsDescriptions);
        assertEquals(true, validationResult.value.showXAxisBarsDescriptions);
    },

    'test invalid descriptions amount': function () {
        var model = {
            'Show X axis bars descriptions': 'True',
            'X axis bars descriptions': [
                {"Description": "1"},
                {"Description": "2"},
                {"Description": "3"}
            ]
        };

        var validationResult = this.presenter.validateAxisXBarsDescriptions(model, 4);

        assertFalse(validationResult.isValid);
        assertEquals("AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID", validationResult.errorCode);
    }
});

TestCase("[Graph]  Axis X series description validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
    },

    'test valid descriptions amount': function () {
        var model = {
            'Show X axis series descriptions': 'True',
            'X axis series descriptions': [
                {"Description": "1"},
                {"Description": "2"},
                {"Description": "3"}
            ]
        };
        var validationResult = this.presenter.validateAxisXSeriesDescriptions(model, 3);

        assertTrue(validationResult.isValid);
        assertEquals(["1", "2", "3"], validationResult.value.axisXSeriesDescriptions);
        assertEquals(true, validationResult.value.showXAxisSeriesDescriptions);
    },

    'test invalid descriptions amount': function () {
        var model = {
            'Show X axis series descriptions': 'True',
            'X axis series descriptions': [
                {"Description": "1"},
                {"Description": "2"},
                {"Description": "3"}
            ]
        };
        var validationResult = this.presenter.validateAxisXSeriesDescriptions(model, 4);

        assertFalse(validationResult.isValid);
        assertEquals("AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID", validationResult.errorCode);
    }
});
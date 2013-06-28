TestCase("Model validation", {
    setUp: function () {
        this.presenter = Addongraph_create();
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
        },
            expectedData = [
                [1, 2, 3, 4],
                [2, 0, -6, -8],
                [20, 4, 6, 8]
            ];

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);

        assertEquals('graph1', validationResult.ID);

        assertEquals(expectedData, validationResult.data);

        assertEquals(-10.5, validationResult.axisYMinimumValue);
        assertEquals(10.5, validationResult.axisYMaximumValue);
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

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertUndefined(validationResult.errorCode);

        assertEquals('graph1', validationResult.ID);

        assertEquals(expectedData, validationResult.data);

        assertEquals(-10.5, validationResult.axisYMinimumValue);
        assertEquals(10.5, validationResult.axisYMaximumValue);
        assertEquals(2.5, validationResult.axisYGridStep);

        assertTrue(validationResult.isInteractive);
        assertEquals(2.5, validationResult.interactiveStep);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.shouldCalcScore);

        assertTrue(validationResult.isDecimalSeparatorSet);
        assertEquals(',', validationResult.decimalSeparator);
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
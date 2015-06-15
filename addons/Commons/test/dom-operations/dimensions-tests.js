TestCase("[Commons - Dom Operations] Get outer dimensions", {
    'test missing styles': function() {
        /*:DOC += <div id="element1"></div> */
        var expectedDimensions = {
            border: { top: 0, bottom: 0, left: 0, right: 0 },
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
            padding: { top: 0, bottom: 0, left: 0, right: 0 }
        };

        var outerDimensions = DOMOperationsUtils.getOuterDimensions($('#element1'));

        assertEquals(expectedDimensions, outerDimensions);
    },

    'test styles properly set': function() {
        /*:DOC += <div id="element2" style="border:4px solid gray; margin: 2px 3px 4px 5px; padding: 3px 2px 1px 2px;"></div> */
        var expectedDimensions = {
            border: { top: 4, bottom: 4, left: 4, right: 4 },
            margin: { top: 2, bottom: 4, left: 5, right: 3 },
            padding: { top: 3, bottom: 1, left: 2, right: 2 }
        };

        var outerDimensions = DOMOperationsUtils.getOuterDimensions($('#element2'));

        assertEquals(expectedDimensions, outerDimensions);
    }
});

TestCase("[Commons - Dom Operations] Calculate outer distance", {
    'test proper dimensions': function() {
        var dimensions = {
            border: { top: 1, bottom: 2, left: 3, right: 2 },
            margin: { top: 2, bottom: 3, left: 3, right: 1 },
            padding: { top: 3, bottom: 4, left: 4, right: 4 }
        };
        var expectedDistances = {
            vertical: 15,
            horizontal: 17
        };

        var outerDistances = DOMOperationsUtils.calculateOuterDistances(dimensions);

        assertEquals(expectedDistances, outerDistances)
    }
});

TestCase("[Commons - Dom Operations] Calculate reduced size", {
    'test simple calculation': function() {
        /*:DOC += <div id="element-reduced-size-wrapper" style="width: 200px; height: 140px;"></div> */
        /*:DOC += <div id="element-reduced-size" style="border:4px solid gray; margin: 2px 3px 4px 5px; padding: 3px 2px 1px 2px;"></div> */
        var expectedSize = {
            width: 180,
            height: 122
        };

        var newSize = DOMOperationsUtils.calculateReducedSize($('#element-reduced-size-wrapper'), $('#element-reduced-size'));

        assertEquals(expectedSize, newSize)
    }
});

TestCase("[Commons - Dom Operations] Set reduced size", {
    'test simple calculation': function() {
        /*:DOC += <div id="element-set-size-wrapper" style="width: 200px; height: 140px;"></div> */
        /*:DOC += <div id="element-set-size" style="border:4px solid gray; margin: 2px 3px 4px 5px; padding: 3px 2px 1px 2px;"></div> */
        var expectedSize = {
            width: 180,
            height: 122
        };

        var newSize = DOMOperationsUtils.setReducedSize($('#element-set-size-wrapper'), $('#element-set-size'));

        assertEquals(expectedSize, newSize)
        assertEquals('180px', $('#element-set-size').css('width'));
        assertEquals('122px', $('#element-set-size').css('height'));
    }
});

TestCase("[Commons - Dom Operations] Show error message", {
    setUp: function() {
        this.ERROR_CODES = {
            'ERR_01': "Error message 1",
            'ERR_02': "Error message 2",
            'ERR_03': "Error message 3",
            'ERR_04': "Error message 4",
            'ERR_05': "Error message 5"
        };
    },

    'test show error message for existing code': function() {
        /*:DOC += <div id="error-wrapper-1">No errors</div> */

        DOMOperationsUtils.showErrorMessage($('#error-wrapper-1'), this.ERROR_CODES, 'ERR_02');

        assertEquals("Error message 2", $('#error-wrapper-1').text());
    },

    'test error code not found': function() {
        /*:DOC += <div id="error-wrapper-2">No errors</div> */

        DOMOperationsUtils.showErrorMessage($('#error-wrapper-2'), this.ERROR_CODES, 'ERR_0A');

        assertEquals("No errors", $('#error-wrapper-2').text());
    }
});
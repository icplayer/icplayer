TestCase("Model Validation Test Case", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
    },


    'test depth of expand empty': function () {
        var model = {
            'expandDepth': ''
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertEquals('0', validationResult.expandDepth);
    },

    'test depth of expand correct': function () {
        var model = {
            'expandDepth': '1'
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isValid);
        assertEquals('1', validationResult.expandDepth);
    },

    'test depth of expand not numeric': function () {
        var model = {
            'expandDepth': 'a'
        };

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isValid);
        assertEquals('EXPAND_DEPTH_NOT_NUMERIC', validationResult.errorCode);
    }


});
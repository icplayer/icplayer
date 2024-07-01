TestCase("[Paragraph] Model parsing", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test default font values': function() {
        var model = {
            'ID': 'Paragraph1'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font family': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font family': 'cursive'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('11px', validatedModel.fontSize);
    },

    'test user font size': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('Verdana,Arial,Helvetica,sans-serif', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user font family and size': function () {
        var model = {
            'ID': 'Paragraph1',
            'Default font family': 'cursive',
            'Default font size': '14px'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('cursive', validatedModel.fontFamily);
        assertEquals('14px', validatedModel.fontSize);
    },

    'test user custom CSS file': function () {
        var model = {
            'ID': 'Paragraph1',
            'Custom CSS': '/file/serve/123'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('/file/serve/123', validatedModel.content_css);
    },

    'test visible toolbar': function () {
        var model = {
            'ID': 'Paragraph1',
            'Height': 168
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isToolbarHidden);
        assertEquals(131, validatedModel.textAreaHeight);
    },

    'test hide toolbar': function () {
        var model = {
            'ID': 'Paragraph1',
            'Height': 168,
            'Hide toolbar': 'True'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isToolbarHidden);
        assertEquals(166, validatedModel.textAreaHeight);
    },

    'test placeholder\'s plugin name should not contains spaces': function() {
        var model = {
            'ID': 'Paragraph ID with spaces',
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(1, validatedModel.pluginName.split(" ").length);
    },

    'test placeholder\'s plugin name should be alphanumerical': function() {
        var model = {
            'ID': 'Paragraph\'s name !# with :special... char$ """'
        };

        var validatedModel = this.presenter.validateModel(model);
        assertNotEquals("", validatedModel.pluginName);
        assertEquals("", validatedModel.pluginName.replace(/[a-z0-9_]+/gi, ""));
    },

    'test given manual grading and title when properties set then should be the same in model': function () {
        var model = {
            'ID': 'Paragraph ID',
            'Manual grading': false,
            'Title': 'Sample'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.validateModel(upgradedModel);

        assertEquals('Sample', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test given manual grading and title when properties are empty then should be empty and false in model': function () {
        var model = {
            'ID': 'Paragraph ID'
        };

        var upgradedModel = this.presenter.upgradeModel(model);
        var validatedModel = this.presenter.validateModel(upgradedModel);

        assertEquals('', validatedModel.title);
        assertEquals(false, validatedModel.manualGrading);
    },

    'test not given value as weight when validating model in run mode then use default value 1 as weight': function () {
        const model = {
            'ID': 'Paragraph ID'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(1, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test not given value as weight when validating model in preview mode then use default value 1 as weight': function () {
        const model = {
            'ID': 'Paragraph ID'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(1, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the lowest number that can be accepted as weight when validating model in run mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '0'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(0, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the lowest number that can be accepted as weight when validating model in preview mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '0'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(0, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the largest number that can be accepted as weight when validating model in run mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '100'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(100, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given the largest number that can be accepted as weight when validating model in preview mode then accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '100'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(100, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given random string as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': 'Lorem'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given random string as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': 'Lorem'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given negative number as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '-1'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given negative number as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '-1'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given number larger then 100 as weight when validating model in run mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '101'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given number larger then 100 as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '101'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given float as weight when validating model in run mode then execute floor on value and accept it to the model': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '2.8'
        };
        const isPreview = false;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals(2, validatedModel.weight);
        assertTrue(validatedModel.isValid);
    },

    'test given float as weight when validating model in preview mode then return "W_01" error code': function () {
        const model = {
            'ID': 'Paragraph ID',
            'Weight': '2.8'
        };
        const isPreview = true;

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel, isPreview);

        assertEquals("W_01", validatedModel.errorCode);
        assertFalse(validatedModel.isValid);
    },

    'test given model with Block in error checking mode empty when validating model then isBlockedInErrorCheckingMode should be set to false in model': function () {
        const model = {
            "ID": "Paragraph ID"
        };

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel);

        assertEquals(false, validatedModel.isBlockedInErrorCheckingMode);
    },

    'test given model with Block in error checking mode set to True when validating model then isBlockedInErrorCheckingMode should be set to true in model': function () {
        const model = {
            "ID": "Paragraph ID",
            "Block in error checking mode": "True",
        };

        const upgradedModel = this.presenter.upgradeModel(model);
        const validatedModel = this.presenter.validateModel(upgradedModel);

        assertEquals(true, validatedModel.isBlockedInErrorCheckingMode);
    },
});

TestCase("[Paragraph] ToolbarValidation", {

    setUp: function () {
        this.presenter = AddonParagraph_create();
    },

    'test custom toolbar available buttons': function() {
        var customToolbar = 'newdocument bold italic underline strikethrough alignleft aligncenter alignright ' +
            'alignjustify styleselect formatselect fontselect fontsizeselect ' +
            'bullist numlist outdent indent blockquote undo redo removeformat subscript superscript';

        var model = {
            'ID': 'Paragraph1',
            "Width": (customToolbar.split(" ").length) * 40 + this.presenter.DEFAULTS.FORMAT_WIDTH,
            'Custom toolbar': customToolbar
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(model['Custom toolbar'], validatedModel.toolbar);
    },

    'test custom toolbar unavailable buttons removed silently': function() {
        var model = {
            'ID': 'Paragraph1',
            'Width': 500,
            'Custom toolbar': 'italic underline bold test fake button'
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals('italic underline bold', validatedModel.toolbar);
    },

    'test blank custom toolbar': function() {
        var model = {
            'ID': 'Paragraph1',
            'Width': 10*36,
            'Custom toolbar': ''
        };

        var validatedModel = this.presenter.validateModel(model);

        assertEquals(this.presenter.DEFAULTS.TOOLBAR, validatedModel.toolbar);
    }
});

TestCase("[Paragraph] ParseToolbarWithoutGroups", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
    },
    
    'test default toolbar parsing': function () {
        var result = this.presenter.parseToolbarWithoutGroups(this.presenter.DEFAULTS.TOOLBAR.split(" "), 1000);

        assertEquals(result, this.presenter.DEFAULTS.TOOLBAR);
        
        result = this.presenter.parseToolbarWithoutGroups(this.presenter.DEFAULTS.TOOLBAR.split(" "), 100);
        var expectedResult = "bold italic | underline numlist | bullist alignleft | aligncenter alignright | alignjustify";
        assertEquals(result, expectedResult);
    },

    "test toolbar with style select name": function () {
        var toolbar = "bold styleselect italic underline numlist bullist alignleft aligncenter alignright alignjustify";
        var result = this.presenter.parseToolbarWithoutGroups(toolbar.split(" "), 100);
        var expectedResult = "bold | styleselect | italic underline | numlist bullist | alignleft aligncenter | alignright alignjustify";
        assertEquals(result, expectedResult);
    }
});

TestCase("[Paragraph] ParseToolbarWithGroups", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.toolbar = "bold italic underline numlist | bullist alignleft aligncenter alignright | alignjustify".split(" ");
    },

    'test no controls buttons should return empty string': function () {
        var result = this.presenter.parseToolbarWithGroups(" | ".split(" "), 100);
        assertEquals(result, "");
    },

    'test controls buttons with groups': function () {
        var result = this.presenter.parseToolbarWithGroups(this.toolbar, 100);
        var expectedResult = "bold italic | underline numlist | bullist alignleft | aligncenter alignright | alignjustify";
        assertEquals(result, expectedResult);
    }
});
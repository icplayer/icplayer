TestCase("[Multiple Gap] Model validation", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();

        sinon.stub(this.presenter, 'validateItems');
    },

    tearDown: function () {
        this.presenter.validateItems.restore();
    },

    'test proper model configuration with some items answer ids': function () {
        this.presenter.validateItems.returns({isError: false, value: {}});
        var model = {
            ID: 'MultipleGap1',
            "Is Visible": "True",
            "Items": [
                {"Answer ID": "answer1"},
                {"Answer ID": "answer2"},
                {"Answer ID": "answer3"}
            ],
            "wrapItems": "True"
        };
        
        var expectedItemAnswersIDs = [
          "answer1",
          "answer2",
          "answer3"
        ];

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorCode);

        assertEquals('MultipleGap1', validationResult.ID);
        assertTrue(validationResult.isActivity);
        assertEquals(this.presenter.ORIENTATIONS.HORIZONTAL, validationResult.orientation);
        assertEquals(this.presenter.SOURCE_TYPES.IMAGES, validationResult.sourceType);
        assertFalse(validationResult.stretchImages);
        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertEquals(expectedItemAnswersIDs, validationResult.itemsAnswersID);
        assertTrue(validationResult.wrapItems);
    },
    
    'test proper model configuration with empty items answer ids': function () {
        this.presenter.validateItems.returns({isError: false, value: {}});
        var model = {
            ID: 'MultipleGap1',
            "Is Visible": "True",
            "Items": [],
            "wrapItems": "False"
        };
        
        var expectedItemAnswersIDs = [];
        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorCode);

        assertEquals('MultipleGap1', validationResult.ID);
        assertTrue(validationResult.isActivity);
        assertEquals(this.presenter.ORIENTATIONS.HORIZONTAL, validationResult.orientation);
        assertEquals(this.presenter.SOURCE_TYPES.IMAGES, validationResult.sourceType);
        assertFalse(validationResult.stretchImages);
        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertEquals(expectedItemAnswersIDs, validationResult.itemsAnswersID);
        assertFalse(validationResult.wrapItems);
    },
    
    'test proper model configuration with single item answer id': function () {
        this.presenter.validateItems.returns({isError: false, value: {}});
        var model = {
            ID: 'MultipleGap1',
            "Is Visible": "True",
            "Items": [
                {"Answer ID": "answer1"}
            ]
        };
        
        var expectedItemAnswersIDs = [
          "answer1"
        ];
        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);
        assertUndefined(validationResult.errorCode);

        assertEquals('MultipleGap1', validationResult.ID);
        assertTrue(validationResult.isActivity);
        assertEquals(this.presenter.ORIENTATIONS.HORIZONTAL, validationResult.orientation);
        assertEquals(this.presenter.SOURCE_TYPES.IMAGES, validationResult.sourceType);
        assertFalse(validationResult.stretchImages);
        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertEquals(expectedItemAnswersIDs, validationResult.itemsAnswersID);
    },

    'test invalid some item property': function () {
        this.presenter.validateItems.returns({isError: true, errorCode: 'Invalid'});
        var model = {
            ID: 'MultipleGap1'
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isError);
        assertEquals(validationResult.errorCode, 'Invalid');
    }
});

TestCase("[Multiple Gap] Items validation", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
    },

    'test width has invalid value': function () {
        var model = {
            'Item width': '0'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertTrue(validatedItems.isError);
        assertEquals('INVALID_ITEM_WIDTH', validatedItems.errorCode);
    },

    'test height has invalid value': function () {
        var model = {
            'Item width': '10',
            'Item height': '0'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertTrue(validatedItems.isError);
        assertEquals('INVALID_ITEM_HEIGHT', validatedItems.errorCode);
    },

    'test spacing has invalid value': function () {
        var model = {
            'Item width': '10',
            'Item height': '15',
            'Item spacing': '-1'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertTrue(validatedItems.isError);
        assertEquals('INVALID_ITEM_SPACING', validatedItems.errorCode);
    },

    'test maximum item count has invalid value': function () {
        var model = {
            'Item width': '10',
            'Item height': '15',
            'Item spacing': '2',
            'Maximum item count': '0'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertTrue(validatedItems.isError);
        assertEquals('INVALID_MAXIMUM_ITEM_COUNT', validatedItems.errorCode);
    },

    'test valid configuration': function () {
        var model = {
            'Item width': '10',
            'Item height': '15',
            'Item spacing': '2',
            'Maximum item count': '3',
            'Item horizontal align': 'left',
            'Item vertical align': 'bottom'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertFalse(validatedItems.isError);
        assertUndefined(validatedItems.errorCount);
        assertEquals(10, validatedItems.value.width);
        assertEquals(15, validatedItems.value.height);
        assertEquals(2, validatedItems.value.spacing);
        assertEquals(3, validatedItems.value.maximumCount);
        assertEquals('left', validatedItems.value.horizontalAlign);
        assertEquals('bottom', validatedItems.value.verticalAlign);
    },

    'test empty configuration': function () {
        var model = {
            'Item width': '',
            'Item height': '',
            'Item spacing': '',
            'Maximum item count': '',
            'Item horizontal align': 'left',
            'Item vertical align': 'bottom'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertFalse(validatedItems.isError);
        assertUndefined(validatedItems.errorCount);
        assertNaN(validatedItems.value.width);
        assertNaN(validatedItems.value.height);
        assertNaN(validatedItems.value.spacing);
        assertNaN(validatedItems.value.maximumCount);
        assertEquals('left', validatedItems.value.horizontalAlign);
        assertEquals('bottom', validatedItems.value.verticalAlign);
    },

    'test values are not a numbers - compatibility': function () {
        var model = {
            'Item width': 'a',
            'Item height': 'a',
            'Item spacing': 'a',
            'Maximum item count': 'a',
            'Item horizontal align': 'left',
            'Item vertical align': 'bottom'
        };

        var validatedItems = this.presenter.validateItems(model);

        assertFalse(validatedItems.isError);
        assertUndefined(validatedItems.errorCount);
        assertNaN(validatedItems.value.width);
        assertNaN(validatedItems.value.height);
        assertNaN(validatedItems.value.spacing);
        assertNaN(validatedItems.value.maximumCount);
        assertEquals('left', validatedItems.value.horizontalAlign);
        assertEquals('bottom', validatedItems.value.verticalAlign);
    }
});
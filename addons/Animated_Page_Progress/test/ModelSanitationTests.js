TestCase("Model sanitation", {
    setUp: function () {
        this.presenter = AddonPage_Rating_create();
    },

    'test default model': function () {
        var model = {
            Rates: [{
                Deselected: '',
                Selected: ''
            }],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_01', sanitationResult.errorCode);
    },

    'test model with filled item1': function () {
        var model = {
            Rates: [{
                Deselected: 'image1',
                Selected: 'image2'
            }],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_01', sanitationResult.errorCode);
    },

    'test model without selected image': function () {
        var model = {
            Rates: [{
                Deselected: 'image1',
                Selected: 'image2'
            },
            {
                Deselected: 'image3',
                Selected: ''
            }
            ],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_02', sanitationResult.errorCode);
    },

    'test model without any selected/deselected image': function () {
        var model = {
            Rates: [{
                Deselected: '',
                Selected: ''
            },
            {
                Deselected: '',
                Selected: ''
            }
            ],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_02', sanitationResult.errorCode);
    },

    'test model without one image': function () {
        var model = {
            Rates: [{
                Deselected: 'image1',
                Selected: 'image2'
            },
            {
                Deselected: 'image3',
                Selected: ''
            },
            {
                Deselected: 'image5',
                Selected: 'image6'
            }
            ],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_02', sanitationResult.errorCode);
    },

    'test model went well': function () {
        var model = {
            Rates: [{
                Deselected: 'image1',
                Selected: 'image2'
            },
            {
                Deselected: 'image3',
                Selected: 'image4'
            },
            {
                Deselected: 'image5',
                Selected: 'image6'
            }
            ],
            ID: 'Page_Rating1'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
    },

    'test proper config': function () {
        var model = {
            Rates: [{
                Deselected: 'image1',
                Selected: 'image2'
            },
            {
                Deselected: 'image3',
                Selected: 'image4'
            }],
            'Title Text': 'Title',
            'Comment Text': 'Comment'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
        assertEquals('Title', sanitationResult.title);
        assertEquals('Comment', sanitationResult.comment);
        assertEquals(["image1","image3"], sanitationResult.rates.deselected);
        assertEquals(["image2","image4"], sanitationResult.rates.selected);
        assertEquals(2, sanitationResult.length);
    }

});

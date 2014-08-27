TestCase("Model sanitation", {
    setUp: function () {
        this.presenter = AddonAnimated_Lesson_Progress_create();
    },

    'test default model': function () {
        var model = {
            Ranges: [{
                Score: '',
                Image: ''
            }]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_05', sanitationResult.errorCode);
    },

    'test first score does not equal 0': function () {
        var model = {
            Ranges: [
                {
                    Score: '10',
                    Image: ''
                },
                {
                    Score: '20',
                    Image: ''
                },
                {
                    Score: '100',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_04', sanitationResult.errorCode);
    },

    'test last score does not equal 100': function () {
        var model = {
            Ranges: [
                {
                    Score: '0',
                    Image: ''
                },
                {
                    Score: '20',
                    Image: ''
                },
                {
                    Score: '90',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_02', sanitationResult.errorCode);
    },

    'test scores are not in ascending order': function () {
        var model = {
            Ranges: [
                {
                    Score: '0',
                    Image: ''
                },
                {
                    Score: '80',
                    Image: ''
                },
                {
                    Score: '70',
                    Image: ''
                },
                {
                    Score: '100',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_01', sanitationResult.errorCode);
    },

    'test score is not positive': function () {
        var model = {
            Ranges: [
                {
                    Score: '-3',
                    Image: ''
                },
                {
                    Score: '0',
                    Image: ''
                },
                {
                    Score: '70',
                    Image: ''
                },
                {
                    Score: '100',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_03', sanitationResult.errorCode);
    },

    'test score is not filled': function () {
        var model = {
            Ranges: [
                {
                    Score: '0',
                    Image: ''
                },
                {
                    Score: '',
                    Image: ''
                },
                {
                    Score: '70',
                    Image: ''
                },
                {
                    Score: '100',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_05', sanitationResult.errorCode);
    },

    'test proper model': function () {
        var model = {
            Ranges: [
                {
                    Score: '0',
                    Image: ''
                },
                {
                    Score: '20',
                    Image: ''
                },
                {
                    Score: '70',
                    Image: ''
                },
                {
                    Score: '100',
                    Image: ''
                }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
    }
});

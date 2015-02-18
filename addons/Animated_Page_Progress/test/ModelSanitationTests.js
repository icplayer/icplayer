TestCase("[Animated Page Progress] Model sanitation", {
    setUp: function () {
        this.presenter = AddonAnimated_Page_Progress_create();
    },

    'test default model': function () {
        var model = {
            Ranges: [
                { Score: '', Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_05', sanitationResult.errorCode);
    },

    'test first score does not equal 0': function () {
        var model = {
            Ranges: [
                { Score: '10', Image: '' },
                { Score: '20', Image: '' },
                { Score: '100', Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_04', sanitationResult.errorCode);
    },

    'test last score does not equal 100': function () {
        var model = {
            Ranges: [
                { Score: '0',Image: '' },
                { Score: '20',Image: '' },
                { Score: '90',Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_02', sanitationResult.errorCode);
    },

    'test scores are not in ascending order': function () {
        var model = {
            Ranges: [
                { Score: '0', Image: '' },
                { Score: '80', Image: '' },
                { Score: '70', Image: '' },
                { Score: '100', Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_01', sanitationResult.errorCode);
    },

    'test score is not positive': function () {
        var model = {
            Ranges: [
                { Score: '-3', Image: '' },
                { Score: '0', Image: '' },
                { Score: '70', Image: '' },
                { Score: '100', Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_03', sanitationResult.errorCode);
    },

    'test score is not filled': function () {
        var model = {
            Ranges: [
                { Score: '0', Image: '' },
                { Score: '', Image: '' },
                { Score: '70', Image: '' },
                { Score: '100', Image: '' }
            ]
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertTrue(sanitationResult.isError);
        assertEquals('E_05', sanitationResult.errorCode);
    },

    'test proper model': function () {
        var model = {
            Ranges: [
                { Score: '0', Image: '' },
                { Score: '20', Image: '' },
                { Score: '70', Image: '' },
                { Score: '100', Image: ''}
            ],
            'Is Visible': 'False',
            'Initial image': ''
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
        assertEquals([0, 20, 70, 100], sanitationResult.ranges.maxScores);
        assertEquals(['', '', '', ''], sanitationResult.ranges.images);
        assertEquals(false, sanitationResult.isVisible);
        assertEquals('', sanitationResult.initialImage);
    },

    'test proper full filled model': function () {
        var model = {
            Ranges: [
                { Score: '0', Image: '/file/serve/5506491670855680' },
                { Score: '20', Image: '/file/serve/5506491670855681' },
                { Score: '70', Image: '/file/serve/5506491670855682' },
                { Score: '100', Image: '/file/serve/5506491670855683'}
            ],
            'Is Visible': 'True',
            'Initial image': '/file/serve/5506491670855684'
        };

        var sanitationResult = this.presenter.sanitizeModel(model);

        assertFalse(sanitationResult.isError);
        assertEquals([0, 20, 70, 100], sanitationResult.ranges.maxScores);
        assertEquals(['/file/serve/5506491670855680', '/file/serve/5506491670855681', '/file/serve/5506491670855682', '/file/serve/5506491670855683'], sanitationResult.ranges.images);
        assertEquals(true, sanitationResult.isVisible);
        assertEquals('/file/serve/5506491670855684', sanitationResult.initialImage);
    }
});

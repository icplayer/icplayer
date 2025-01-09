TestCase("[Coloring] Score", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.isShowAnswersActive = false;
        this.presenter.configuration = { isActivity: true};
        this.presenter.imageHasBeenLoaded = true;
        this.presenter.isShowAnswersActive = false;

        this.stubs = {
            getColorAtPoint: sinon.stub(this.presenter, 'getColorAtPoint')
        };
    },

    tearDown: function () {
        this.presenter.getColorAtPoint.restore();
    },

    'test checking score for only normal areas - all valid colored': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);

        var validationResult = this.presenter.getScore();

        assertEquals(4, validationResult);
    },

    'test checking score for only normal areas - no valid colored': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([5, 6, 8, 123]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([123, 123, 1321, 321]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([123, 43, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([-1, -1, -1, -1]);

        var validationResult = this.presenter.getScore();

        assertEquals(0, validationResult);
    },

    'test checking score for areas, no valid': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 5, y: 5, defaultColor: [5, 5, 5, 5], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 6, y: 6, defaultColor: [6, 6, 6, 6], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([5, 6, 8, 123]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([123, 123, 1321, 321]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([123, 43, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(5, 5).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(6, 6).returns([-1, -1, -1, -1]);

        var validationResult = this.presenter.getScore();

        assertEquals(0, validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertTrue(this.presenter.configuration.transparentAreaError);
    },

    'test checking score for areas, some valid with invalid transparent': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 5, y: 5, defaultColor: [5, 5, 5, 5], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 6, y: 6, defaultColor: [6, 6, 6, 6], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([123, 43, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(5, 5).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(6, 6).returns([-1, -1, -1, -1]);

        var validationResult = this.presenter.getScore();

        assertEquals(2, validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertTrue(this.presenter.configuration.transparentAreaError);
    },

    'test checking score for areas, some valid with valid transparent': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 5, y: 5, defaultColor: [5, 5, 5, 5], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 6, y: 6, defaultColor: [6, 6, 6, 6], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([123, 43, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(5, 5).returns([5, 5, 5, 5]);
        this.stubs.getColorAtPoint.withArgs(6, 6).returns([6, 6, 6, 6]);

        var validationResult = this.presenter.getScore();

        assertEquals(2, validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    },

    'test checking score for areas, all valid': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 5, y: 5, defaultColor: [5, 5, 5, 5], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 6, y: 6, defaultColor: [6, 6, 6, 6], colorToFill: [-1, -1, -1, -1], type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(5, 5).returns([5, 5, 5, 5]);
        this.stubs.getColorAtPoint.withArgs(6, 6).returns([6, 6, 6, 6]);

        var validationResult = this.presenter.getScore();

        assertEquals(4, validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    },

    'test when image has not been loaded & isActivity': function () {
        this.presenter.imageHasBeenLoaded = false;
        this.presenter.savedScore = true;

        var validationResult = this.presenter.getScore();

        assertEquals(0, validationResult);
    },

    'test when image has not been loaded & not isActivity': function () {
        this.presenter.isActivity = false;
        this.presenter.imageHasBeenLoaded = false;
        this.presenter.savedScore = false;

        var validationResult = this.presenter.getScore();

        assertEquals(0, validationResult);
    },

    'test when show answers is active': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.currentScore = 5;

        var validationResult = this.presenter.getScore();

        assertEquals(5, validationResult);
    }
});

TestCase("[Coloring] Score for transparent area", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.configuration = {};
        this.stubs = {
            getColorAtPoint: sinon.stub(this.presenter, 'getColorAtPoint')
        };
    },

    tearDown: function () {
        this.presenter.getColorAtPoint.restore();
    },

    'test checking valid coloring': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);

        var validationResult = this.presenter.getScoreForTransparentArea({x: 1, y:1, defaultColor: [1, 1, 1, 1]});

        assertEquals(0, validationResult);
        assertUndefined(this.presenter.configuration.transparentAreaError);
    },

    'test checking invalid coloring': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([5342, 324, 432, 432]);

        var validationResult = this.presenter.getScoreForTransparentArea({x: 1, y:1, defaultColor: [1, 1, 1, 1]});

        assertEquals(0, validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertTrue(this.presenter.configuration.transparentAreaError);
    }
});

TestCase("[Coloring] Score for normal area", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.configuration = {};

        this.stubs = {
            getColorAtPoint: sinon.stub(this.presenter, 'getColorAtPoint')
        }
    },

    tearDown: function () {
        this.presenter.getColorAtPoint.restore();
    },

    'test detecting valid coloring of area': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);

        var validationResult = this.presenter.getScoreForNormalArea({x: 1, y: 1, colorToFill: [9, 9, 9, 9], defaultColor: [1, 1, 1, 1]});

        assertEquals(2, this.stubs.getColorAtPoint.callCount);
        assertEquals(1, validationResult);
    },

    'test detecting invalid coloring of area': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([7, 7, 7, 7]);

        var validationResult = this.presenter.getScoreForNormalArea({x: 1, y: 1, colorToFill: [9, 9, 9, 9], defaultColor: [1, 1, 1, 1]});

        assertEquals(2, this.stubs.getColorAtPoint.callCount);
        assertEquals(0, validationResult);
    },

    'test detecting no coloring made to area': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);
        var validationResult = this.presenter.getScoreForNormalArea({x: 1, y: 1, colorToFill: [9, 9, 9, 9], defaultColor: [1, 1, 1, 1]});

        assertEquals(1, this.stubs.getColorAtPoint.callCount);
        assertEquals(0, validationResult);
    }
});

TestCase("[Coloring] Max score validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.configuration = {isActivity: true};
    },

    'test normal areas only': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, type: this.presenter.AREA_TYPE.NORMAL},
            {x: 4, y: 4, type: this.presenter.AREA_TYPE.NORMAL}
        ];

        var validationResult = this.presenter.getMaxScore();

        assertEquals(4, validationResult);

        this.presenter.configuration.areas = [
            {x: 1, y: 1, type: this.presenter.AREA_TYPE.NORMAL}
        ];

        validationResult = this.presenter.getMaxScore();
        assertEquals(1, validationResult);
    },

    'test transparent areas only': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 2, y: 2, type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 3, y: 3, type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 4, y: 4, type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        var validationResult = this.presenter.getMaxScore();

        assertEquals(0, validationResult);

        this.presenter.configuration.areas = [
            {x: 1, y: 1, type: this.presenter.AREA_TYPE.TRANSPARENT}
        ];

        validationResult = this.presenter.getMaxScore();

        assertEquals(0, validationResult);
    },

    'test mixed areas': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 2, y: 2, type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, type: this.presenter.AREA_TYPE.TRANSPARENT},
            {x: 4, y: 4, type: this.presenter.AREA_TYPE.NORMAL}
        ];

        var validationResult = this.presenter.getMaxScore();

        assertEquals(2, validationResult);
    },

    'test no areas': function () {
        this.presenter.configuration.areas = [];

        var validationResult = this.presenter.getMaxScore();

        assertEquals(0, validationResult);

    },

    'test coloring is not activity': function () {
        this.presenter.configuration.isActivity = false;

        var validationResult = this.presenter.getMaxScore();

        assertEquals(0, validationResult);
    }
});
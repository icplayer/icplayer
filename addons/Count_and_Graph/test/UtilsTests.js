TestCase("[Count_and_Graph] Error object validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test creating error objects properly': function () {
        var validationResult = this.presenter.getErrorObject("YAM");

        assertFalse(validationResult.isValid);
        assertEquals("YAM", validationResult.errorCode);

        validationResult = this.presenter.getErrorObject("239o84");

        assertFalse(validationResult.isValid);
        assertEquals("239o84", validationResult.errorCode);
    }
});

TestCase("[Count_and_Graph] Float validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test checking floats input': function () {
        assertTrue(this.presenter.isFloat(12.54));
        assertTrue(this.presenter.isFloat(0.54));
        assertTrue(this.presenter.isFloat(-12.54));
        assertTrue(this.presenter.isFloat(-123.54));
    },

    'test checking non floats input': function () {
        assertFalse(this.presenter.isFloat(-5));
        assertFalse(this.presenter.isFloat(1));
        assertFalse(this.presenter.isFloat(2));
        assertFalse(this.presenter.isFloat(3.00));
    }
});

TestCase("[Count_and_Graph] Float in values", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test values dont have float': function () {
        assertFalse(this.presenter.isFloatInValues([1.0, 5, 123, -123, -5, 123, 5]));
    },

    'test values have float': function () {
        assertTrue(this.presenter.isFloatInValues([1.0, 5, 123, -123, -5, 123, 5, 0.0001]));
    }
});

TestCase("[Count_and_Graph] RGB value validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
    },

    'test value is valid #RGB format': function () {
        assertTrue(this.presenter.isRGB("#ABCDEF"));
        assertTrue(this.presenter.isRGB("#012345"));
        assertTrue(this.presenter.isRGB("#789112"));
        assertTrue(this.presenter.isRGB("#abcdef"));
    },

    'test value is invalid #RGB format': function () {
        assertFalse(this.presenter.isRGB("# nbvsh"));
        assertFalse(this.presenter.isRGB("#nbzopq"));
        assertFalse(this.presenter.isRGB("1p289;34uy p9sa"));
    }
});

TestCase("[Count_and_Graph] Is all ok", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.stubs = {
            getScore: sinon.stub(this.presenter, 'getScore'),
            getMaxScore: sinon.stub(this.presenter, 'getMaxScore')
        };
    },

    tearDown: function () {
        this.presenter.getScore.restore();
        this.presenter.getMaxScore.restore();
    },

    'test when score is equal to max score all is ok': function () {
        this.stubs.getScore.returns(3);
        this.stubs.getMaxScore.returns(3);

        assertTrue(this.presenter.isAllOk());
    },

    'test when score is not equal max score all is not ok': function () {
        this.stubs.getScore.returns(2);
        this.stubs.getMaxScore.returns(4);

        assertFalse(this.presenter.isAllOk());
    }
});
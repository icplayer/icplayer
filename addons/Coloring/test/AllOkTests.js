TestCase("[Coloring] All Ok", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.isShowAnswersActive = false;
        this.presenter.imageHasBeenLoaded = true;
        this.presenter.configuration = {
            isActivity: true,
            areas: [
                {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
                {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
                {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
                {x: 4, y: 4, defaultColor: [4, 4, 4, 4], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL}
            ]
        };

        this.stubs = { getColorAtPoint: sinon.stub(this.presenter, 'getColorAtPoint')};
    },

    tearDown: function () {
        this.presenter.getColorAtPoint.restore();
    },

    'test normal areas only, all isOk': function () {
        this.stubs.getColorAtPoint.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);


        var validationResult = this.presenter.isAllOK();

        assertTrue(validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    },


    'test transparent areas only, all isOk': function () {
        this.presenter.configuration.areas[0].type = this.presenter.AREA_TYPE.TRANSPARENT;
        this.presenter.configuration.areas[1].type = this.presenter.AREA_TYPE.TRANSPARENT;
        this.presenter.configuration.areas[2].type = this.presenter.AREA_TYPE.TRANSPARENT;
        this.presenter.configuration.areas[3].type = this.presenter.AREA_TYPE.TRANSPARENT;

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([2, 2, 2, 2]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([3, 3, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([4, 4, 4, 4]);


        var validationResult = this.presenter.isAllOK();

        assertTrue(validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    },

    'test mixed areas, all isOk': function () {
        this.presenter.configuration.areas[0].type = this.presenter.AREA_TYPE.TRANSPARENT;
        this.presenter.configuration.areas[1].type = this.presenter.AREA_TYPE.TRANSPARENT;

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([2, 2, 2, 2]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);


        var validationResult = this.presenter.isAllOK();

        assertTrue(validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    },

    'test mixed areas, all is not Ok': function () {
        this.presenter.configuration.areas[0].type = this.presenter.AREA_TYPE.TRANSPARENT;
        this.presenter.configuration.areas[1].type = this.presenter.AREA_TYPE.TRANSPARENT;

        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([-1, -1, -1, -1]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([9, 9, 9, 9]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);


        var validationResult = this.presenter.isAllOK();

        assertTrue(this.presenter.configuration.transparentAreaError);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(validationResult);


        this.stubs.getColorAtPoint.withArgs(1, 1).returns([1, 1, 1, 1]);
        this.stubs.getColorAtPoint.withArgs(2, 2).returns([2, 2, 2, 2]);
        this.stubs.getColorAtPoint.withArgs(3, 3).returns([3, 3, 3, 3]);
        this.stubs.getColorAtPoint.withArgs(4, 4).returns([9, 9, 9, 9]);


        var validationResult = this.presenter.isAllOK();

        assertFalse(validationResult);
        assertNotUndefined(this.presenter.configuration.transparentAreaError);
        assertFalse(this.presenter.configuration.transparentAreaError);
    }
});
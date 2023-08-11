TestCase("[Coloring] Functionality Tests", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas' : '55; 150; 255 200 255 255',
            'Tolerance' : '50',
            'DefaultFillingColor' : [255, 50, 50, 255]
        };

        this.presenter.configuration = {
            'tolerance' : 50,
            'lastUsedColor' : [255, 255, 0, 255],
            'areas' : [
            ],
            'defaultFillingColor' : [255, 50, 50, 255],
            'colorsThatCanBeFilled' : [[255, 255, 255, 255]]
        };

        sinon.stub(this.presenter, 'clearCanvas');
        sinon.stub(this.presenter, 'recolorImage');
        this.getColorAtPointStub = sinon.stub(this.presenter, 'getColorAtPoint');
        this.fillAreaSpy = sinon.spy(this.presenter, 'fillArea');

        this.presenter.$view = $('<div></div>');

        var canvasElement = $('<canvas></canvas>');
        this.presenter.ctx = canvasElement[0].getContext('2d');
        this.presenter.canvasWidth = 200;
        this.presenter.canvasHeight = 100;
    },

    tearDown : function() {
        this.presenter.clearCanvas.restore();
        this.presenter.recolorImage.restore();
        this.presenter.getColorAtPoint.restore();
    },

    'test reset restores last used color when is erase is true' : function() {
        this.presenter.configuration.isErase = true;
        this.presenter.reset();

        assertEquals(false, this.presenter.configuration.isErase);
        assertEquals([255, 255, 0, 255], this.presenter.configuration.currentFillingColor);
    },

    'test reset restores default filling color when is erase is false' : function() {
        this.presenter.configuration.isErase = false;
        this.presenter.reset();

        assertEquals([255, 50, 50, 255], this.presenter.configuration.currentFillingColor);
    },

    'test reset call clear canvas' : function() {
        this.presenter.reset();

        assertTrue(this.presenter.clearCanvas.calledOnce);
    },

    'test is already in colors that can be filled returns true if color is already in' : function() {
        var result = this.presenter.isAlreadyInColorsThatCanBeFilled([255, 255, 255, 255]);

        assertTrue(result);
    },

    'test is already in colors that can be filled returns false if color is NOT in' : function() {
        var result = this.presenter.isAlreadyInColorsThatCanBeFilled([200, 255, 255, 255]);

        assertFalse(result);
    },

    'test given resetOnlyWrong parameter on true when reset was called then remove only incorrect answers': function () {
        this.presenter.configuration.areas = [
            {x: 1, y: 1, defaultColor: [1, 1, 1, 1], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 2, y: 2, defaultColor: [2, 2, 2, 2], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL},
            {x: 3, y: 3, defaultColor: [3, 3, 3, 3], colorToFill: [9, 9, 9, 9], type: this.presenter.AREA_TYPE.NORMAL}
        ];
        this.getColorAtPointStub.withArgs(1, 1).returns([9, 9, 9, 9]);
        this.getColorAtPointStub.withArgs(2, 2).returns([9, 9, 9, 9]);
        this.getColorAtPointStub.withArgs(3, 3).returns([7, 7, 7, 7]);

        this.presenter.reset(true);

        assertTrue(this.fillAreaSpy.calledWith(3, 3, '255 255 255 255', true));
    }
});
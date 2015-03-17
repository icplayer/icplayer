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

        this.presenter.$view = $('<div></div>');
    },

    tearDown : function() {
        this.presenter.clearCanvas.restore();
        this.presenter.recolorImage.restore();
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
    }
});
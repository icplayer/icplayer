TestCase("[Coloring] Comparing arrays validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
    },

    'test compareColors true': function () {
        var compareResult = this.presenter.compareArrays([255, 255, 255, 255], [255, 255, 255, 255]);
        assertEquals(true, compareResult);
    },

    'test compareColors false': function () {
        var compareResult = this.presenter.compareArrays([255, 255, 255, 255], [250, 154, 200, 250]);
        assertEquals(false, compareResult);
    }
});

TestCase("[Coloring] Transparent validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
    },

    'test checking proper values': function () {
        assertTrue(this.presenter.isTransparent(["30", "15", "transparent"]));
    },

    'test checking invalid value': function () {
        assertFalse(this.presenter.isTransparent(["25", "15","255 255 0 255"]));
        assertFalse(this.presenter.isTransparent(["10", "25","trensperent"]));
        assertFalse(this.presenter.isTransparent(["55", "15","fd.lahhlfdsa"]));
        assertFalse(this.presenter.isTransparent(["55", "15", ""]));
        assertFalse(this.presenter.isTransparent(["55", "15", "p;41 ;gh 23 3rth9ifdgashi; "]));
    }
});

TestCase("[Coloring] getColorAtPoint validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();

        this.stubs = {getImageData: sinon.stub()};
        this.presenter.ctx = {getImageData: this.stubs.getImageData};
    },

    'test getColorAtPoint sample color': function () {
        this.stubs.getImageData.withArgs(0,0).returns({data: [255,0,0,255]});
        assertEquals([255,0,0,255],this.presenter.getColorAtPoint(0,0));
    }

});

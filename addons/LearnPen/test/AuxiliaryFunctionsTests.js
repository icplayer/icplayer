TestCase("[DrawingSmartPen] Auxiliary functions", {

    setUp: function() {
        this.presenter = AddonLearnPen_create();
    },

    'test converting hex to rgba' : function() {
        assertEquals('rgba(255,255,255,1)', this.presenter.hexToRGBA("#FFFFFF", 1));
        assertEquals('rgba(0,0,0,0.5)', this.presenter.hexToRGBA('#000000', 0.5));
        assertEquals('rgba(168,5,204,0)', this.presenter.hexToRGBA('#a805cc', 0));
        assertEquals('rgba(16,17,18,1)', this.presenter.hexToRGBA('#101112', 1));
    },

    'test color name to hex' : function() {
        assertFalse(this.presenter.colourNameToHex("maka paka"));
        assertEquals('#ff0000', this.presenter.colourNameToHex("rEd"));
        assertEquals('#008000', this.presenter.colourNameToHex("greeN"));
        assertEquals('#0000ff', this.presenter.colourNameToHex("Blue"));
        assertEquals('#ff6347', this.presenter.colourNameToHex("toMATo"));
    }
});
TestCase("Frame name validation and manipulation", {
    setUp: function() {
        this.presenter = AddonImage_Viewer_Public_create();
        this.frameNames = [{
            name: "ImageViewer1",
            frame: "0"
        }, {
            name: "ImageViewer3",
            frame: "2"
        }, {
            name: "ImageViewer5",
            frame: "4"
        }];
    },

    tearDown: function() {
    },

    'test frame name is valid' : function() {
        assertTrue(this.presenter.isValidFrameName('ImageViewer1'));
    },

    'test frame name undefined' : function() {
        assertFalse(this.presenter.isValidFrameName());
    },

    'test frame name empty string' : function() {
        assertFalse(this.presenter.isValidFrameName(''));
    },

    'test frame name found' : function() {
        var result = this.presenter.findFrame('ImageViewer3', this.frameNames);

        assertTrue(result.found);
        assertEquals(2, result.frameNumber);
    },

    'test frame name not found' : function() {
        var result = this.presenter.findFrame('TrueFalse2', this.frameNames);

        assertFalse(result.found);
    },

    'test find frame in empty array' : function() {
        this.frameNames = [];

        var result = this.presenter.findFrame('ImageViewer1', this.frameNames);

        assertFalse(result.found);
    }
});
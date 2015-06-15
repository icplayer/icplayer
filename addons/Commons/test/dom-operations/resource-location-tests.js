TestCase("[Commons - Dom Operations] Resource location", {
    setUp: function () {
        this.controller = {
            staticFilesPath: "http://images.google.com/",
            getStaticFilesPath: function () { return this.staticFilesPath; }
        }
    },

    'test Player Controller undefined': function() {
        var resourceFullPath = DOMOperationsUtils.getResourceFullPath(undefined, "media/loading.gif");

        assertUndefined(resourceFullPath);
    },

    'test Player Controller defined but no resource provided': function () {
        var resourceFullPath = DOMOperationsUtils.getResourceFullPath(this.controller, undefined);

        assertUndefined(resourceFullPath);
    },

    'test both Player Controller and resource are defined': function () {
        var resourceFullPath = DOMOperationsUtils.getResourceFullPath(this.controller, "media/loading.gif");

        assertEquals(this.controller.staticFilesPath + "media/loading.gif", resourceFullPath);
    },

    'test both Player Controller and resource are defined but resource is empty string': function () {
        var resourceFullPath = DOMOperationsUtils.getResourceFullPath(this.controller, "");

        assertUndefined(resourceFullPath);
    }
});
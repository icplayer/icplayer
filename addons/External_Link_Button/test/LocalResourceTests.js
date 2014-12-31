TestCase("[External Link Button] Local resource", {
    setUp: function () {
        this.presenter = AddonExternal_Link_Button_create();

        this.presenter.playerController = {
            getCurrentPageIndex: function () {
                return 0
            },
            getPresentation: function () {
                return {
                    getPage: function () {
                        return {
                            getBaseURL: function () {
                                return 'http://www.mauthor.com/lesson/pages/';
                            }
                        };
                    }
                };
            }
        };
    },
    
    'test uri points to external resource without extension': function () {
        assertFalse(this.presenter.isLocalResource('http://www.mauthor.com/file/serve/123456'));
    },

    'test uri points to external resource with extension': function () {
        assertFalse(this.presenter.isLocalResource('http://www.mauthor.com/file/serve/123456.png'));
    },

    'test uri points to local SCORM resource': function () {
        assertTrue(this.presenter.isLocalResource('../resources/123456.png'));
    },

    'test uri points to local SCORM resource without extension': function () {
        assertFalse(this.presenter.isLocalResource('../resources/123456'));
    },

    'test uri points to external resource that looks like local one': function () {
        assertFalse(this.presenter.isLocalResource('http://mauthor.com/../resources/123456.png'));
    },

    'test fixing local resource URI': function () {
        this.presenter.configuration = {
            URI: '../resources/123456.png'
        };

        this.presenter.fixLocalResourceURI();

        assertEquals('http://www.mauthor.com/lesson/pages/../resources/123456.png', this.presenter.configuration.URI);
    }
});
TestCase("[Commons - URL Utils] getBaseURL method", {
    setUp: function () {
        this.baseURL = "https://test.com/resources/";
    },

    createPlayerController: function (contextMetadata) {
        var self = this;
        return {
            getContextMetadata: function () {
                return contextMetadata;
            },
            getCurrentPageIndex: function() {
                return 0;
            },
            getPresentation: function() {
                return {
                    getPage: function(pageIndex) {
                        return {
                            getBaseURL: function() {
                                return self.baseURL;
                            }
                        };
                    }
                };
             }
        };
    },

    'test given undefined as playerController when executing method then returns undefined': function (){
        var playerController = undefined;

        var result = URLUtils.getBaseURL(playerController);

        assertUndefined(result);
    },

    'test given null as playerController when executing method then returns undefined': function (){
        var playerController = null;

        var result = URLUtils.getBaseURL(playerController);

        assertUndefined(result);
    },

    'test given contextMetadata without contentBaseURL key when executing method then returns baseURL base on current page index': function (){
        var contextMetadata = {
            "someKey": "someValue"
        };
        var playerController = this.createPlayerController(contextMetadata);

        var result = URLUtils.getBaseURL(playerController);

        assertEquals(this.baseURL, result);
    },

    'test given null as contextMetadata when executing method then returns baseURL base on current page index': function (){
        var contextMetadata = null;
        var playerController = this.createPlayerController(contextMetadata);

        var result = URLUtils.getBaseURL(playerController);

        assertEquals(this.baseURL, result);
    },

    'test given undefined as contextMetadata when executing method then returns baseURL base on current page index': function (){
        var contextMetadata = undefined;
        var playerController = this.createPlayerController(contextMetadata);

        var result = URLUtils.getBaseURL(playerController);

        assertEquals(this.baseURL, result);
    },

    'test given contextMetadata with contentBaseURL key when executing method then returns contentBase value': function (){
        var expectedBaseURL = "https://test.com/somePath/resources/";
        var contextMetadata = {
            "someKey": "someValue",
            "contentBaseURL": expectedBaseURL
        };
        var playerController = this.createPlayerController(contextMetadata);

        var result = URLUtils.getBaseURL(playerController);

        assertEquals(expectedBaseURL, result);
    },
});

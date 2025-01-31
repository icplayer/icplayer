TestCase("[Commons - URL Utils] prepareImageForCanvas method", {
    setUp: function () {
        this.image = new Image();
    },

    createPlayerController: function (isURLMatchesWhitelist) {
         return {
            getRequestsConfig: function () {
                return {
                    isURLMatchesWhitelist: function (url) {
                        return isURLMatchesWhitelist;
                    }
                };
            }
        };
    },

    validateIfElementDoesNotHasCrossoriginAttribute: function (element) {
        assertNull(element.getAttribute("crossorigin"));
    },

    validateIfElementHasCrossoriginAttribute: function (element) {
        assertEquals("anonymous", element.getAttribute("crossorigin"));
    },

    'test given image with /file/serve/ pattern URL when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "?no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with shameless /file/serve/ pattern URL when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "//mauthor.com/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "?no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with absolute /file/serve/ URL when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "https://mauthor.com/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "?no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with /file/serve/ pattern URL with parameter when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "&no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with shameless /file/serve/ pattern URL with parameter when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "&no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with absolute /file/serve/ URL with parameter when executing method then URL will have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "https://mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url + "&no_gcs=True", this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image without /file/serve/ in URL when executing method then URL will not have additional no_gcs parameter': function (){
        this.playerController = this.createPlayerController(false);
        var url = "https://mauthor.com/file/servee/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementDoesNotHasCrossoriginAttribute(this.image);
    },

    'test given image with /file/serve/ pattern URL on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image with shameless /file/serve/ pattern URL on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "//mauthor.com/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image with absolute /file/serve/ URL on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "https://mauthor.com/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image with /file/serve/ pattern URL with parameter on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image with shameless /file/serve/ pattern URL with parameter on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image with absolute /file/serve/ URL with parameter on white list when executing method then img will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "https://mauthor.com/file/serve/4834816278659072?SignURL=123";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },

    'test given image without /file/serve/ in URL when executing method then URL will have crossorigin attribute': function (){
        this.playerController = this.createPlayerController(true);
        var url = "https://mauthor.com/file/serve/4834816278659072";

        URLUtils.prepareImageForCanvas(this.playerController, this.image, url);

        assertEquals(url, this.image.getAttribute("src"));
        this.validateIfElementHasCrossoriginAttribute(this.image);
    },
});

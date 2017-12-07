TestCase("[Iframe] initialization", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.validateModel = function () {
            return {
                isValid: true,
                haveURL: false,
                allowFullScreen: false,
                altText: '',
                index: '/file/serve/test_url'
            };
        };

        this.view = document.createElement("div");
        this.iframeElement = document.createElement("iframe");
        this.view.appendChild(this.iframeElement);

    },

    'test if iframe is from /file/serve/<id> url then addon will add no_gcs attribute to path' : function () {
        this.presenter.initialize(this.view, {});

        assertEquals('/file/serve/test_url?no_gcs=true', $(this.iframeElement).attr('src'));
    },

});
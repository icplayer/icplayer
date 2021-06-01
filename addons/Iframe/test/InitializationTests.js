TestCase("[Iframe] initialization", {

    setUp: function () {
        this.presenter = AddonIframe_create();
        this.setUpValidateModel = function(url){
            this.presenter.validateModel = function () {
                return {
                    isValid: true,
                    haveURL: false,
                    allowFullScreen: false,
                    altText: '',
                    index: url
                };
            };
        }

        this.view = document.createElement("div");
        this.iframeElement = document.createElement("iframe");
        this.view.appendChild(this.iframeElement);
        this.setUpValidateModel('/file/serve/test_url');

    },

    'test if iframe is from /file/serve/<id> url then addon will add no_gcs attribute to path' : function () {
        this.presenter.initialize(this.view, {});

        assertEquals('/file/serve/test_url?no_gcs=true', $(this.iframeElement).attr('src'));
    },

    'test if unauthenticatedToken is in contextMetadata, and no_gcs is configured, then mAu4T and no_gcs param is in src' : function () {
        this.presenter.unAuthenticatedToken = "123";
        const expectedSrc = '/file/serve/test_url?no_gcs=true&mAu4T=123'

        this.presenter.initialize(this.view, {});

        assertEquals(expectedSrc, $(this.iframeElement).attr('src'));
    },

    'test if unauthenticatedToken is in contextMetadata, and no no_gcs configured, then only mAu4T param in src' : function () {
        this.presenter.unAuthenticatedToken = "123";
        this.setUpValidateModel('/test_url');
        const expectedSrc = '/test_url?mAu4T=123'

        this.presenter.initialize(this.view, {});

        assertEquals(expectedSrc, $(this.iframeElement).attr('src'));
    },

    'test if unauthenticatedToken is in contextMetadata, and src has user params, then mAu4T and user params in src' : function () {
        this.presenter.unAuthenticatedToken = "123";
        this.setUpValidateModel('/test_url?my_param1=2&my_param2=3');
        const expectedSrc = '/test_url?my_param1=2&my_param2=3&mAu4T=123'

        this.presenter.initialize(this.view, {});

        assertEquals(expectedSrc, $(this.iframeElement).attr('src'));
    },

    'test if anchor is in url, and unauthenticatedToken is in contextMetadata, then mAu4T param is in query params in src' : function () {
        this.presenter.unAuthenticatedToken = "123";
        this.setUpValidateModel('/test_url#header');
        const expectedSrc = '/test_url?mAu4T=123#header'

        this.presenter.initialize(this.view, {});

        assertEquals(expectedSrc, $(this.iframeElement).attr('src'));
    }

});
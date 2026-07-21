TestCase("[Commons - URL Utils] parseCSSFileText method", {

    setUp: function () {
        this.getBaseURLStub = sinon.stub(window.URLUtils, 'getBaseURL');
        this.originStub = sinon.stub(window.URLUtils, 'getOrigin');
        this.originStub.returns(TEST_ORIGIN);
    },

    tearDown: function () {
        this.getBaseURLStub.restore();
        this.originStub.restore();
    },

    prepareGetBaseURLStub: function (baseURL) {
        this.getBaseURLStub.returns(baseURL);
    },

    createPlayerController: function (useFileServePattern, sign = undefined, withAllAssets = true) {
        return {
            getRequestsConfig: function () {
                return {
                    signURL: function (url) {
                        return !!sign ? url + sign : url;
                    }
                };
            },
            getAssets: function() {
                return {
                    getAssetsAsJS: function () {
                        var prefix = useFileServePattern ? "/file/serve/" : '../resources/';

                        function createHrefForAsset(id, suffix) {
                            if (useFileServePattern) {
                                return prefix + id;
                            }
                            return prefix + id + suffix;
                        }
                        var assets = [
                            {fileName: 'avenir_normal.woff2', type: '', href: createHrefForAsset('6451119054848', '.woff2')},
                            {fileName: 'avenir_italic.woff2', type: '', href: createHrefForAsset('9126390317056', '.woff2')},
                            {fileName: 'paragraph.css', type: 'text/css', href: createHrefForAsset('0709304590336', '.css')}
                        ];
                        if (withAllAssets) {
                            assets.push({fileName: 'avenir_normal.woff', type: '', href: createHrefForAsset('5340707192832', '.woff')});
                            assets.push({fileName: 'avenir_italic.woff', type: '', href: createHrefForAsset('2628306698240', '.woff')});
                        }
                        return assets;
                    }
                }
            }
        };
    },

    'test given /file/serve/ syntax assets and /file/ content base when executing method then returns same content': function () {
        this.prepareGetBaseURLStub('/file/');
        var playerController = this.createPlayerController(true);

        var parsedText = URLUtils.parseCSSFileText(playerController, CSS_TEXT_WITH_FILE_SERVE_SYNTAX);

        assertEquals(CSS_TEXT_EXPECTD_FILE_SERVE_SYNTAX, parsedText);
    },

    'test given /file/serve/ syntax assets and /file/serve/ content base when executing method then returns same content': function () {
        this.prepareGetBaseURLStub('/file/serve/');
        var playerController = this.createPlayerController(true);

        var parsedText = URLUtils.parseCSSFileText(playerController, CSS_TEXT_WITH_FILE_SERVE_SYNTAX);

        assertEquals(CSS_TEXT_EXPECTD_FILE_SERVE_SYNTAX, parsedText);
    },

    'test given ../resources/ syntax assets and content base with /file/serve/ when executing method then returns parsed content using content base': function () {
        this.prepareGetBaseURLStub(TEST_BASE_URL);
        var playerController = this.createPlayerController(false);

        var parsedText = URLUtils.parseCSSFileText(playerController, CSS_TEXT_WITH_FILE_SERVE_SYNTAX);

        assertEquals(TEST_1_EXPECTED_CSS_TEXT, parsedText);
    },

    'test given CSS with /file/serve/ and absolute links when executing method then returns parsed content': function () {
        this.prepareGetBaseURLStub(TEST_BASE_URL);
        var playerController = this.createPlayerController(false);

        var parsedText = URLUtils.parseCSSFileText(playerController, TEST_2_CSS_TEXT);

        assertEquals(TEST_2_EXPECTED_CSS_TEXT, parsedText);
    },

    'test given CSS with /file/serve/ and duplication of links when executing method then returns parsed content': function () {
        this.prepareGetBaseURLStub(TEST_BASE_URL);
        var playerController = this.createPlayerController(false);

        var parsedText = URLUtils.parseCSSFileText(playerController, TEST_3_CSS_TEXT);

        assertEquals(TEST_3_EXPECTED_CSS_TEXT, parsedText);
    },

    'test given CSS with /file/serve/ links that are not in assets when executing method then returns parsed content': function () {
        this.prepareGetBaseURLStub(TEST_BASE_URL);
        var playerController = this.createPlayerController(false, undefined, false);

        var parsedText = URLUtils.parseCSSFileText(playerController, CSS_TEXT_WITH_FILE_SERVE_SYNTAX);

        assertEquals(TEST_4_EXPECTED_CSS_TEXT, parsedText);
    },

    'test given CSS with /file/serve/ links that are not in assets and from another origin when executing method then returns parsed content': function () {
        this.prepareGetBaseURLStub(TEST_BASE_URL);
        var playerController = this.createPlayerController(false, undefined, false);

        var parsedText = URLUtils.parseCSSFileText(playerController, TEST_5_CSS_TEXT);

        assertEquals(TEST_5_EXPECTED_CSS_TEXT, parsedText);
    },
});

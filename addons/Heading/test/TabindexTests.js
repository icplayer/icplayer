TestCase('[Heading] Tabindex adding tests', {
    setUp: function () {
        this.presenter = AddonHeading_create();

        this.configuration = {
            isValid: true,
            heading: 'h1',
            content: 'content',
            isTabindexEnabled: true
        };

        this.stubs = {
            validateModelStub: sinon.stub().returns(this.configuration),
            parseAltTextsStub: sinon.stub()
        };
        this.stubs.parseAltTextsStub.returnsArg(0);

        this.presenter.validateModel = this.stubs.validateModelStub;

        this.view = $('<div> </div>');

        const textParser = {
            parseAltTexts: this.stubs.parseAltTextsStub,
        };
        const playerController = {
            getTextParser: function () {
                return textParser;
            }
        }
        this.presenter.setPlayerController(playerController);
    },

    'test should set tabindex to 0 for heading h1': function () {
        this.presenter.presenterLogic(this.view, {}, false);

        const result = $(this.view).find('h1');
        assertEquals(1, result.length);
        assertEquals(0, result.attr("tabindex"));
    },

    'test should not set tabindex to 0 for heading h1 when isTabindexEnabled is false': function () {
        this.configuration.isTabindexEnabled = false;

        this.presenter.presenterLogic(this.view, {}, false);

        const result = $(this.view).find('h1');
        assertEquals(1, result.length);
        assertEquals(undefined, result.attr("tabindex"));
    }
});
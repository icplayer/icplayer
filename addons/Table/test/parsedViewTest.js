TestCase("[Table] parseGapsWrapper function", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.htmlParsedObject = {
            parsedText: "parsedText",
            gaps: [],
            inLineGaps: []
        };

        this.stubs = {
            getParsedHTMLViewStub: sinon.stub().returns(this.htmlParsedObject),
            getInputSizeStub: sinon.stub(),
            htmlStub: sinon.stub(),
            changeSimpleStub: sinon.stub(),
            getInputsSizeStub: sinon.stub()
        };

        this.presenter.$view = {
            html: this.stubs.htmlStub
        };

        this.presenter.textParser = {
            parseGaps: this.stubs.getParsedHTMLViewStub
        };

        this.presenter.getInputsSize = this.stubs.getInputSizeStub;
        this.presenter.configuration = {
            isCaseSensitive: {}
        };
    },
    
    'test should set html of view to "parsedText"  when not in preview mode': function () {
        var isPreview = false;
        this.htmlParsedObject.parsedText = 'parsedText';
        this.presenter.parseGapsWrapper({}, isPreview);

        var result = this.stubs.htmlStub.calledWith('parsedText');

        assertTrue(result);
    },

    'test should set html of view to "parsedText" in preview': function () {
        var isPreview = true;
        this.htmlParsedObject.parsedText = 'parsedText';

        this.presenter.parseGapsWrapper({}, isPreview);

        var result = this.stubs.htmlStub.calledWith('parsedText');

        assertTrue(result);
    }
});
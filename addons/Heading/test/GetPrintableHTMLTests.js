function stubTextParser (self) {
    self.stubs = {
        parseAltTextsStub: sinon.stub()
    };
    self.stubs.parseAltTextsStub.returnsArg(0);
    const textParser = {
        parseAltTexts: self.stubs.parseAltTextsStub,
    };
    const playerController = {
        getTextParser: function () {
            return textParser;
        }
    }
    self.presenter.setPlayerController(playerController);
}

TestCase("[Heading] getPrintableHTML tests when empty printable state mode", {

    setUp: function () {
        this.presenter = AddonHeading_create();
        this.showAnswers = false;
        this.model = {
            "ID": "Heading1",
            "Heading": "h2",
            "Content": "content"
        };
        stubTextParser(this);
    },

    'test should parse alt texts': function() {
        this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertTrue(this.stubs.parseAltTextsStub.called);
    },

    'test should return HTML with content and heading form model': function() {
        const expectedHTML = '<div id="Heading1" class="printable_addon_Heading"><h2>content</h2></div>';

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
    }
});

TestCase("[Heading] getPrintableHTML tests when show answers printable state mode", {

    setUp: function () {
        this.presenter = AddonHeading_create();
        this.showAnswers = true;
        this.model = {
            "ID": "Heading1",
            "Heading": "h2",
            "Content": "content"
        };
        stubTextParser(this);
    },

    'test should parse alt texts': function() {
        this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertTrue(this.stubs.parseAltTextsStub.called);
    },

    'test should return HTML with content and heading form model': function() {
        const expectedHTML = '<div id="Heading1" class="printable_addon_Heading"><h2>content</h2></div>';

        const actualHTML = this.presenter.getPrintableHTML(this.model, this.showAnswers);

        assertEquals(expectedHTML, actualHTML);
    }
});

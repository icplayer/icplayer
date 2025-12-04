TestCase("[Paragraph Keyboard] Reset method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.configuration = {
            isValid: true,
            placeholderText: "placeholder"
        };
        this.spies = {
            setContent: sinon.spy(),
            setStyles: sinon.spy(),
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            removePlaceholder: sinon.spy(),
            addPlaceholder: sinon.spy()
        };

        this.presenter.editor = {
            id: "mce_1",
            setContent: this.spies.setContent,
            initialized: true
        };

        this.presenter.placeholder = {
            removePlaceholder: this.spies.removePlaceholder,
            addPlaceholder: this.spies.addPlaceholder
        }

        this.presenter.setStyles = this.spies.setStyles;

        this.presenter.textParser = {
            parseAltTexts: sinon.stub(),
        };
        this.presenter.textParser.parseAltTexts.returnsArg(0);

    },

    'test when placeholder is not editable on reset set content to empty string': function () {
        this.presenter.configuration.isPlaceholderEditable = false;

        this.presenter.reset();

        assertEquals("", this.spies.setContent.getCall(0).args[0]);
    },

    'test when placeholder is not editable on reset set old styles back': function () {
        this.presenter.configuration.isPlaceholderEditable = false;

        this.presenter.reset();

        assertEquals(true, this.spies.setStyles.calledOnce);
    },

    'test when placeholder is editable on reset set content to placeholder text': function () {
        this.presenter.configuration.isPlaceholderEditable = true;

        this.presenter.reset();

        assertEquals("placeholder", this.spies.setContent.getCall(0).args[0]);
    }
});

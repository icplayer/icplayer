TestCase("[Paragraph] getText and setText method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true
        };
        this.spies = {
            setContent: sinon.spy()
        };

        this.presenter.editor = {
            id: "mce_1",
            setContent: this.spies.setContent,
            getContent: function getContentMock(params) {return 'hello world';}
        };

    },

    'test when setText is called directly it sets the correct value in editor': function () {
        this.presenter.setText("hello world");

        assertEquals("hello world", this.spies.setContent.getCall(0).args[0]);
    },

    'test when setText as a command it sets the correct value in editor': function () {
        this.presenter.executeCommand("settext",["hello world"]);

        assertEquals("hello world", this.spies.setContent.getCall(0).args[0]);
    },

    'test when getText is called directly it returns correct value': function () {
        this.presenter.setText("hello world");

        assertEquals("hello world", this.spies.setContent.getCall(0).args[0]);
    },

    'test when getText is called as a command it returns correct value': function () {
        var result = this.presenter.getText();

        assertEquals("hello world", result);
    }
});


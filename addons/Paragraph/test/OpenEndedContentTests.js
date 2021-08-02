TestCase("[Paragraph] Open ended content tests", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.editor = {
            id: "mce_1",
            getContent: function () {
                return;
            }
        };

        this.stubs = {
            getContent: sinon.stub(this.presenter.editor, 'getContent')
        };
    },

    tearDown: function () {
        if (this.presenter.editor) {
            this.presenter.editor.getContent.restore();
        }
    },

    'test when getOpenEndedContent is called then return editor content': function () {
        this.stubs.getContent.returns("Content");

        var result = this.presenter.getOpenEndedContent();

        assertEquals("Content", result);
    }

});


TestCase("[Paragraph] getState method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.editor = {
            id: "mce_1",
            getContent: function () {
                return;
            }
        };
        this.presenter.hideAnswers = sinon.spy();
        this.presenter.showAnswers = sinon.spy();
        this.stubs = {
            getContent: sinon.stub(this.presenter.editor, 'getContent')
        };
    },

    tearDown: function () {
        if (this.presenter.editor) {
            this.presenter.editor.getContent.restore();
        }
    },

    'test getState for existing editor': function () {
        this.stubs.getContent.returns("Content");
        var state = JSON.parse(this.presenter.getState());

        assertEquals("Content", state.tinymceState);
    },

    'test getState given editor exists when show answers active then hide answers': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.getState();

        sinon.assert.calledOnce(this.presenter.hideAnswers);
    },

    'test given presenter with showAnswers active when getState called then showAnswers should be called': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getState();

        sinon.assert.calledOnce(this.presenter.showAnswers);
    },

    'test getState for incomplete editor': function () {
        delete this.presenter.editor["id"];

        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    },

    'test getState for non existed editor': function () {
        this.presenter.editor = undefined;

        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    }
});


TestCase("[Paragraph Keyboard] getState method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.state = null;
        this.presenter.hideAnswers = sinon.spy();
    },

    'test getState for existing editor': function () {
        this.presenter.editor = {
            id: "mce_1",
            getContent: function () {
                return "Content";
            }
        };

        var state = JSON.parse(this.presenter.getState());

        assertEquals("Content", state.tinymceState);
    },

    'test getState given editor exists when show answers active then hide answers': function () {
        this.presenter.editor = {
            id: "mce_1",
            getContent: function () {
                return "Content";
            }
        };
        this.presenter.isShowAnswersActive = true;

        this.presenter.getState();

        sinon.assert.calledOnce(this.presenter.hideAnswers);
    },

    'test getState for incomplete editor': function () {
        this.presenter.editor = {
            setContent: function (state) {
                return state;
            }
        };

        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    },

    'test getState for non existed editor': function () {
        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    }
});

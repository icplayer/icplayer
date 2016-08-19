TestCase("[Paragraph] getState method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

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


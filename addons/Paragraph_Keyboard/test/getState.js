TestCase("[Paragraph] getState method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

    },

    'test getState for existing editor': function () {
        var editor = {
            id: "mce_1",
            getContent: function () {
                return "Content";
            }
        };

        window.tinymce = {
            get: function () {
                return editor
            }
        };

        var state = JSON.parse(this.presenter.getState());

        assertEquals("Content", state.tinymceState);
    },

    'test getState for incomplete editor': function () {
        var editor = {
            setContent: function (state) {
                return state;
            }
        };

        window.tinymce = {
            get: function () {
                return editor
            }
        };

        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    },
    'test getState for non existed editor': function () {

        window.tinymce = {
            get: function () {
                return undefined
            }
        };

        var state = JSON.parse(this.presenter.getState());

        assertEquals("", state.tinymceState);
    }
});


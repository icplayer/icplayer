TestCase("[Paragraph] getState method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

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

        assertEquals("Content", this.presenter.getState());
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

        assertEquals("", this.presenter.getState());
    },
    'test getState for non existed editor': function () {

        window.tinymce = {
            get: function () {
                return undefined
            }
        };

        assertEquals("", this.presenter.getState());
    }
});


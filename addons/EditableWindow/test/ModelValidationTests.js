TestCase("[EditableWindow] Model validation", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.model = {
            ID: "EditableWindow1",
            Height: "100",
            Width: "100",
            Top: "100",
            Left: "100",
            Right: "100",
            Bottom: "100",
            index: "/file/666666666",
            audio: "",
            video: "",
            fileList: [],
            textEditor: "",
            isTextEditorContent: "False",
        };
    },

    'test model is valid when the whole data is correct': function () {
        var result = this.presenter.validModel(this.model);

        assertTrue(result.isValid)
    },

    'test model is valid when only audio file is defined': function () {
        this.model.index = "";
        this.model.audio = "/file/666666666";

        var result = this.presenter.validModel(this.model);

        assertTrue(result.isValid)
    },

    'test model is valid when only video file is defined': function () {
        this.model.index = "";
        this.model.video = "/file/666666666";

        var result = this.presenter.validModel(this.model);

        assertTrue(result.isValid)
    },

    'test model is not valid when any file is not defined': function () {
        this.model.index = "";

        var result = this.presenter.validModel(this.model);

        assertFalse(result.isValid)
    },

    'test model is not valid when text is filled but isTextEditorContent is not checked': function () {
        this.model.index = "";
        this.model.textEditor = "some example text";
        this.model.isTextEditorContent = "False";

        let result = this.presenter.validModel(this.model);

        assertFalse(result.isValid);
    },

    'test model is not valid when text is empty and isTextEditorContent is checked': function () {
        this.model.index = "";
        this.model.textEditor = "";
        this.model.isTextEditorContent = "True";

        let result = this.presenter.validModel(this.model);

        assertFalse(result.isValid);
    },

    'test model is valid when text is filled and isTextEditorContent is checked': function () {
        this.model.index = "";
        this.model.textEditor = "some example text";
        this.model.isTextEditorContent = "True";

        let result = this.presenter.validModel(this.model);

        assertTrue(result.isValid);
    },
});
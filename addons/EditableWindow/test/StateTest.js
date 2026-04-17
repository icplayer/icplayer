TestCase("[EditableWindow] get state tests", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();

        this.presenter.configuration.isTinyMceLoaded = true;
        this.presenter.configuration.isTinyMceFilled = true;
        this.presenter.configuration.model = {
            editingEnabled: true,
            isTextEditorContent: true
        };

        this.presenter.configuration.state = {
            isInitialized: false,
            content: "Old content"
        };

        this.presenter.configuration.editor = {
            id: "mce_1",
            getContent: function () {}
        };
        this.stubs = {
            getContent: sinon.stub(this.presenter.configuration.editor, 'getContent')
        };
        this.stubs.getContent.returns("New content");
    },

    tearDown: function () {
        if (this.presenter.configuration.editor) {
            this.presenter.configuration.editor.getContent.restore();
        }
    },

    // Tests when isTextEditorContent is true

    'test old state is returned when TinyMce is not loaded': function () {
        this.presenter.configuration.isTinyMceLoaded = false;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "Old content");
        assertEquals(result.isInitialized, false);
    },

    'test old state is returned when TinyMce is not filled': function () {
        this.presenter.configuration.isTinyMceFilled = false;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "Old content");
        assertEquals(result.isInitialized, false);
    },

    'test new state is returned when TinyMce is loaded and filled': function () {
        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "New content");
        assertEquals(result.isInitialized, false);
    },

    'test initial content is returned when is text editor content and content is not editable': function () {
        this.presenter.configuration.state = {
            isInitialized: false,
            content: null
        };
        this.presenter.configuration.model.isTextEditorContent = true;
        this.presenter.configuration.model.editingEnabled = false;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, null);
        assertEquals(result.isInitialized, false);
    },

    'test initial content is returned when is text editor content, content is not editable and have old state': function () {
        this.presenter.configuration.model.isTextEditorContent = true;
        this.presenter.configuration.model.editingEnabled = false;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, null);
        assertEquals(result.isInitialized, false);
    },

    // Tests when isTextEditorContent is false

    'test new content is returned when is not text editor content and content is not editable': function () {
        this.presenter.configuration.state.isInitialized = true;
        this.presenter.configuration.model.isTextEditorContent = false;
        this.presenter.configuration.model.editingEnabled = false;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "New content");
        assertEquals(result.isInitialized, true);
    },

    'test new content is returned when is not text editor content and content is editable': function () {
        this.presenter.configuration.state.isInitialized = true;
        this.presenter.configuration.model.isTextEditorContent = false;
        this.presenter.configuration.model.editingEnabled = true;

        const result = JSON.parse(this.presenter.getState());

        assertEquals(result.content, "New content");
        assertEquals(result.isInitialized, true);
    },

    // TODO rest
});

TestCase("[EditableWindow] State setting", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.presenter.configuration.timeouts = [];
        this.presenter.configuration.model = {
            editingEnabled: true,
            isTextEditorContent: true
        };
        this.presenter.fillActiveTinyMce = sinon.stub();
        this.clock = sinon.useFakeTimers();
    },

    tearDown: function () {
        this.clock.restore();
    },

    // Tests when isTextEditorContent is true

    'test should set state immediately when content is not loading': function () {
        this.presenter.configuration.contentLoadingLock = false;
        const stateToSet = JSON.stringify({ isInitialized: true, content: "New content" });

        this.presenter.setState(stateToSet);

        assertEquals("New content", this.presenter.configuration.state.content);
        assertTrue(this.presenter.configuration.state.isInitialized);
        assertTrue(this.presenter.fillActiveTinyMce.calledOnce);
    },

    'test should not call fillActiveTinyMce when content is not editable': function () {
        this.presenter.configuration.contentLoadingLock = false;
        this.presenter.configuration.model.editingEnabled = false;
        this.presenter.configuration.model.isTextEditorContent = true;
        const stateToSet = JSON.stringify({ isInitialized: false, content: null });

        this.presenter.setState(stateToSet);

        assertFalse(this.presenter.fillActiveTinyMce.called);
    },

    'test should not call fillActiveTinyMce when content is not editable and has old state': function () {
        this.presenter.configuration.contentLoadingLock = false;
        this.presenter.configuration.model.editingEnabled = false;
        this.presenter.configuration.model.isTextEditorContent = true;
        const stateToSet = JSON.stringify({ isInitialized: true, content: "Old content" });

        this.presenter.setState(stateToSet);

        assertFalse(this.presenter.fillActiveTinyMce.called);
    },

    // Tests when isTextEditorContent is false
});

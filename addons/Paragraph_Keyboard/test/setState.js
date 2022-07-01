TestCase("[Paragraph Keyboard] setState method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.state = null;
        this.content = "Content";
        this.isVisible = true;
        this.isLocked = false;
        this.presenter.configuration = {
            isVisible: true,
            state: "Content"
        }

        this.presenter.editor = {
            id: "mce_1",
            setContent: function () {},
            initialized: true
        };

        this.stubs = {
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            lock: sinon.stub(this.presenter, 'lock'),
            unlock: sinon.stub(this.presenter, 'unlock'),
            setContent: sinon.stub(this.presenter.editor, 'setContent')
        }
    },

    tearDown: function () {
        this.stubs.setVisibility.restore();
        this.stubs.lock.restore();
        this.stubs.unlock.restore();
        if (this.presenter.editor) {
            this.presenter.editor.setContent.restore();
        }
    },

    createState: function () {
        return JSON.stringify({
            'tinymceState' : this.content,
            'isVisible' : this.isVisible,
            'isLocked' : this.isLocked
        });
    },

    'test given state with isVisible set to true when setState was called then visibility is set to true': function () {
        var state = this.createState();

        this.presenter.setState(state);

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.stubs.setVisibility.calledOnce);
        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test given state with isVisible set to false when setState was called then visibility is set to false': function () {
        this.isVisible = false;
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue(this.stubs.setVisibility.calledOnce);
        assertTrue(this.stubs.setVisibility.calledWith(false));
    },

    'test given state with isLocked set to true when setState was called then presenter is locked': function () {
        this.isLocked = true;
        var state = this.createState();

        this.presenter.setState(state);

        assertTrue(this.stubs.lock.calledOnce);
        assertFalse(this.stubs.unlock.called);
    },

    'test given state with isLocked set to false when setState was called then presenter is unlocked': function () {
        var state = this.createState();

        this.presenter.setState(state);

        assertTrue(this.stubs.unlock.calledOnce);
        assertFalse(this.stubs.lock.called);
    },

    'test given state with tinymceState set to empty string when setState was called then do not set new content': function () {
        this.content = "";
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.stubs.setContent.called);
        assertEquals(this.presenter.configuration.state, "Content");
        assertEquals(this.presenter.state, null);
    },

    'test given state with tinymceState set to undefined when setState was called then do not set new content': function () {
        this.content = undefined;
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.stubs.setContent.called);
        assertEquals(this.presenter.configuration.state, "Content");
        assertEquals(this.presenter.state, null);
    },

    'test given state with tinymceState set to element with class placeholder when setState was called then do not set new content': function () {
        this.content = '<p class="placeholder">AAA</p>';
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.stubs.setContent.called);
        assertEquals(this.presenter.configuration.state, "Content");
        assertEquals(this.presenter.state, null);
    },

    'test given state with tinymceState set to valid element and editor is initialized when setState was called then set new content': function () {
        this.content = '<p>AAA</p>';
        var state = this.createState();

        this.presenter.setState(state);

        assertTrue(this.stubs.setContent.calledOnce);
        assertEquals(this.presenter.state, state);
    },

    'test given state with tinymceState set to valid element and editor is set to null when setState was called then do not set new content': function () {
        this.presenter.editor = null;
        this.content = '<p>AAA</p>';
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.stubs.setContent.called);
        assertEquals(this.presenter.state, state);
    },

    'test given state with tinymceState set to valid element and editor is not initialized when setState was called then do not set new content': function () {
        this.presenter.editor.initialized = false;
        this.content = '<p>AAA</p>';
        var state = this.createState();

        this.presenter.setState(state);

        assertFalse(this.stubs.setContent.called);
        assertEquals(this.presenter.state, state);
    },
});

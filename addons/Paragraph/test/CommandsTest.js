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
            getContent: function getContentMock(params) {return 'hello world';},
            initialized: true
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
        var result = this.presenter.getText();

        assertEquals("hello world", result);
    },

    'test when getText is called as a command it returns correct value': function () {
        var result = this.presenter.executeCommand("gettext",[""]);

        assertEquals("hello world", result);
    }
});

TestCase("[Paragraph] lock and unlock method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            ID: "Paragraph1"
        };
        this.presenter.$view = $('<div>');
        this.presenter.$view.append("<div class=\"addon_Paragraph\" id=\"Paragraph1\">" +
            "<div id=\"Paragraph1-wrapper\" class=\"paragraph-wrapper\"><form><textarea class=\"paragraph_field\"></textarea></form>" +
            "</div>");
    },

    'test when lock is called as a command it appends element with class paragraph-lock': function () {
        this.presenter.lock();
        assertTrue(this.presenter.$view.find('.paragraph-lock').length === 1);
    },

    'test when unlock is called after lock as a command there is no element with class paragraph-lock': function () {
        this.presenter.lock();
        this.presenter.unlock();
        assertTrue(this.presenter.$view.find('.paragraph-lock').length === 0);
    }
});

TestCase("[Paragraph] isAttempted method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            ID: "Paragraph1",
            isPlaceholderSet: false,
            isPlaceholderEditable: false,
        };

        this.presenter.editor = {
            'getContent': sinon.stub()
        }
    },

    setUpPlaceholderStateAfterChangedPage: function () {
        this.presenter.placeholder = {
            isSet: true,
            shouldBeSet: false,
            placeholderText: this.presenter.configuration.isPlaceholderEditable ? "" : this.presenter.configuration.placeholderText,
        };
    },

    'test given editor was not loaded and state is not set when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = null;

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertFalse(result);
    },

    'test given editor was not loaded and tinymceState has no text when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = '{"tinymceState":"<p></p>"}';

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertFalse(result);
    },

    'test given editor was not loaded and tinymceState contains text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertTrue(result);
    },

    'test given editor was loaded, no placeholder and editor is empty when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p></p>');

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },

    'test given editor was loaded, no placeholder and editor contains text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertTrue(result);
    },

    'test given editor was loaded, not-editable placeholder set and visible when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<placeholder class="placeholder">hello world</placeholder>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.presenter.placeholder = {
            isSet: true,
            shouldBeSet: true,
            placeholderText: "hello world",
        }

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },

    'test given editor was loaded, not-editable placeholder set but not visible and editor contains text equal to placeholder text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.presenter.placeholder = {
            isSet: false,
            shouldBeSet: false,
            placeholderText: "hello world",
        }

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertTrue(result);
    },

    'test given editor was loaded, not-editable placeholder set and changed page when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<placeholder class="placeholder">hello world</placeholder>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.setUpPlaceholderStateAfterChangedPage();

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },

    'test given editor was loaded, not-editable placeholder set but not visible and changed page when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.setUpPlaceholderStateAfterChangedPage();

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertTrue(result);
    },

    'test given editor was loaded, editable placeholder set and visible when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.isPlaceholderEditable = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.presenter.placeholder = {
            isSet: true,
            shouldBeSet: true,
            placeholderText: "",
        }

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },

    'test given editor was loaded, editable placeholder set and editor contains text not equal to placeholder when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>Hi</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.isPlaceholderEditable = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.presenter.placeholder = {
            isSet: true,
            shouldBeSet: true,
            placeholderText: "",
        }

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertTrue(result);
    },

    'test given editor was loaded, editable placeholder set and editor contains text from placeholder when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.isPlaceholderEditable = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.presenter.placeholder = {
            isSet: false,
            shouldBeSet: false,
            placeholderText: "",
        }

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },

    'test given editor was loaded, editable placeholder set, editor contains text from placeholder and changed page when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.editor.getContent.returns('<p>hello world</p>');
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.isPlaceholderEditable = true;
        this.presenter.configuration.placeholderText = "hello world";
        this.setUpPlaceholderStateAfterChangedPage();

        const result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.calledOnce);
        assertFalse(result);
    },
});

TestCase("[Paragraph] Is AI ready method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            manualGrading: true,
        };
        this.presenter.playerController = {};
        sinon.stub(OpenActivitiesUtils, 'isAIReady');
    },

    tearDown: function () {
        OpenActivitiesUtils.isAIReady.restore();
    },

    'test given configuration with turned off manual grading when isAIReady executed then return false': function () {
        this.presenter.configuration.manualGrading = false;

        const result = this.presenter.isAIReady();

        assertFalse(result);
    },

    'test given not valid configuration when isAIReady executed then return false': function () {
        this.presenter.configuration.isValid = false;

        const result = this.presenter.isAIReady();

        assertFalse(result);
    },

    'test given presenter without player controller when isAIReady executed then return false': function () {
        this.presenter.playerController = undefined;

        const result = this.presenter.isAIReady();

        assertFalse(result);
    },

    'test given set up player to return true when isAIReady executed then return true': function () {
        OpenActivitiesUtils.isAIReady.returns(true);

        const result = this.presenter.isAIReady();

        assertTrue(result);
    },

    'test given set up player to return false when isAIReady executed then return false': function () {
        OpenActivitiesUtils.isAIReady.returns(false);

        const result = this.presenter.isAIReady();

        assertFalse(result);
    },
});

TestCase('[Paragraph Keyboard] Commands test', {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.configuration = {
            ID: 'Paragraph-eKeyboard1',
            isVisible: true,
            isValid: true
        };
        this.presenter.editor = {
            content: 'Paragraph eKeyboard content',
            getContent: function () {
                return this.content;
            },
            setContent: function (text) {
                this.content = text;
            }
        };

        this.view = $("<div></div>");
        this.view.html(
            "<div id=\"Paragraph-eKeyboard1-wrapper\">" +
            "<div class=\"paragraph-keyboard\">" +
            "</div>" +
            "</div>"
        );
        this.presenter.$view = this.view;
    },

    'test given the invisible view when show was called then the view should be visible': function () {
        this.presenter.isVisibleValue = false;

        this.presenter.show();

        assertEquals(this.presenter.$view.css('visibility'), 'visible');
        assertTrue(this.presenter.isVisibleValue);
    },

    'test given the visible view when hide was called then the view should be invisible': function () {
        this.presenter.isVisibleValue = true;

        this.presenter.hide();

        assertEquals(this.presenter.$view.css('visibility'), 'hidden');
        assertFalse(this.presenter.isVisibleValue);
    },

    'test given the unlocked view when lock was called then the view should be locked': function () {
        this.presenter.isLocked = false;

        this.presenter.lock();

        assertTrue(this.presenter.isLocked);
    },

    'test given the locked view when unlock was called then the view should be unlocked': function () {
        this.presenter.isLocked = true;

        this.presenter.unlock();

        assertFalse(this.presenter.isLocked);
    },

    'test given text in the view when getText was called then return the addon content': function () {
        var result = this.presenter.getText();

        assertEquals(result, 'Paragraph eKeyboard content');
    },

    'test given text when setText was called then update the view content': function () {
        var text = 'Updated Paragraph eKeyboard content';

        this.presenter.setText(text);
        var result = this.presenter.getText();

        assertEquals(result, text);
    },
});

TestCase("[Paragraph Keyboard] isAttempted method", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.configuration = {
            ID: 'Paragraph-eKeyboard1',
            isVisible: true,
            isValid: true,
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

TestCase("[Paragraph Keyboard] Is AI ready method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
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

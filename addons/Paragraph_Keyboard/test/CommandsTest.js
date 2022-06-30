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
            isValid: true
        };

        this.presenter.editor = {
            'getContent': sinon.stub()
        }
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

    'test given editor was loaded and editor contains text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';
        this.presenter.editor.getContent.returns('<p>hello world</p>');

        var result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.called);
        assertTrue(result);
    },

    'test given editor was loaded and editor contains no text when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';
        this.presenter.editor.getContent.returns('<p></p>');

        var result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.called);
        assertFalse(result);
    }
});

TestCase('Paragraph Keyboard - commands test', {
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

    'test given text in the view when isAttempted was called then return True': function () {
        var result = this.presenter.isAttempted();

        assertTrue(result);
    }
});
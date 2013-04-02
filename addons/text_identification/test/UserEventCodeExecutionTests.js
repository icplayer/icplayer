TestCase("[Text Identification] User event code execution", {
    setUp : function() {
        this.presenter = Addontext_identification_create();
        this.presenter.configuration = {
            onSelected: "Text1.setText('Module selected!');",
            onDeselected: "Text1.setText('Module deselected!');"
        };

        var commands = this.commands = {
            executeEventCode: function () {}
        };

        this.presenter.playerController = {
            getCommands: function () {
                return commands
            }
        };

        sinon.stub(this.commands, 'executeEventCode');
    },

    tearDown: function () {
        this.commands.executeEventCode.restore();
    },

    'test successful user event execution on module selection' : function() {
        this.presenter.configuration.isSelected = true;

        this.presenter.executeUserEventCode();

        assertTrue(this.commands.executeEventCode.calledWith("Text1.setText('Module selected!');"));
    },

    'test successful user event execution on module deselection' : function() {
        this.presenter.configuration.isSelected = false;

        this.presenter.executeUserEventCode();

        assertTrue(this.commands.executeEventCode.calledWith("Text1.setText('Module deselected!');"));
    },

    'test user event code is empty and module was selected' : function() {
        this.presenter.configuration.isSelected = true;
        this.presenter.configuration.onSelected = "";

        this.presenter.executeUserEventCode();

        assertFalse(this.commands.executeEventCode.called);
    },

    'test user event code is empty and module was deselected' : function() {
        this.presenter.configuration.isSelected = false;
        this.presenter.configuration.onDeselected = "";

        this.presenter.executeUserEventCode();

        assertFalse(this.commands.executeEventCode.called);
    },

    'test Player Controller is not defined' : function() {
        this.presenter.playerController = null;

        this.presenter.executeUserEventCode();

        assertFalse(this.commands.executeEventCode.called);
    }
});
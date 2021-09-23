TestCase("[Group Chat Button] Commands", {
    setUp: function () {
        this.presenter = AddonGroup_Chat_Button_create();
        this.presenter.configuration = {
            title: "123456",
            image: "/file/server/123456"
        };

        this.spies = {
            setVisibility: sinon.spy(),
            sendExternalEvent: sinon.spy()
        };

        this.presenter.playerController = {
            sendExternalEvent: this.spies.sendExternalEvent
        };

        this.presenter.setVisibility = this.spies.setVisibility;
    },

    'test given correct model when requestGroupChat is called then message is sent': function () {
        this.presenter.executeCommand('requestGroupChat');
        this.presenter.requestGroupChat();

        assertTrue(this.spies.sendExternalEvent.calledOnce);
    },

    'test when calling show then set visibility to true': function () {
        this.presenter.show();

        assertTrue(this.spies.setVisibility.calledOnce);
        assertTrue(this.spies.setVisibility.calledWith(true));
    },

    'test when calling hide then set visibility to false': function () {
        this.presenter.hide();

        assertTrue(this.spies.setVisibility.calledOnce);
        assertTrue(this.spies.setVisibility.calledWith(false));
    }
});
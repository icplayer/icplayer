TestCase("External Events", {
    setUp: function () {
        this.presenter = AddonFile_Sender_create();
        this.presenter.configuration = {
            isValid: true,
            sourceType: "File"
        };
        this.presenter.playerController = {
            sendExternalEvent: sinon.spy()
        }
    },

    'test given file sourceType when fireSendFileEvent is called then external event with appropriate values is sent': function () {
        this.presenter.fireSendFileEvent(123,456);

        var parsedData = JSON.parse(this.presenter.playerController.sendExternalEvent.args[0][1]);

        assertEquals("sendFile", this.presenter.playerController.sendExternalEvent.args[0][0]);
        assertEquals([456],parsedData.teachers);
        assertEquals(123, parsedData.fileId);
        assertEquals(0, parsedData.fileType);
    },

    'test given paragraph sourceType when fireSendFileEvent is called then external event with appropriate values is sent': function () {
        this.presenter.configuration.sourceType = "Paragraph";

        this.presenter.fireSendFileEvent(1234,4567);

        var parsedData = JSON.parse(this.presenter.playerController.sendExternalEvent.args[0][1]);

        assertEquals("sendFile", this.presenter.playerController.sendExternalEvent.args[0][0]);
        assertEquals([4567],parsedData.teachers);
        assertEquals(1234, parsedData.fileId);
        assertEquals(2, parsedData.fileType);
    },

    'test given media recorder sourceType when fireSendFileEvent is called then external event with appropriate values is sent': function () {
        this.presenter.configuration.sourceType = "Media Recorder";

        this.presenter.fireSendFileEvent(1235,4568);

        var parsedData = JSON.parse(this.presenter.playerController.sendExternalEvent.args[0][1]);

        assertEquals("sendFile", this.presenter.playerController.sendExternalEvent.args[0][0]);
        assertEquals([4568],parsedData.teachers);
        assertEquals(1235, parsedData.fileId);
        assertEquals(1, parsedData.fileType);
    }
});
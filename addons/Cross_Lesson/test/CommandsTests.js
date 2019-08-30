TestCase("[Cross Lesson] Commands", {
    setUp: function () {
        this.presenter = AddonCross_Lesson_create();
        this.presenter.configuration = {
            buttonText: "Go to lesson",
            image: "/file/server/123456",
            courseID: "1234567",
            lessonID: "testLesson",
            page: "xQNFEDISERT",
            type: "lesson"
        };

        this.spies = {
            setVisibility: sinon.spy(),
            sendMessage: sinon.spy()
        };

        this.presenter.playerController = {
            sendMessage: this.spies.sendMessage
        };

        this.presenter.setVisibility = this.spies.setVisibility;
    },

    'test given correct model when requestCrossLesson is called then send message with correct request': function () {
        this.presenter.executeCommand('requestCrossLesson');

        this.presenter.requestCrossLesson();

        assertTrue(this.spies.sendMessage.calledOnce);
        var message = this.spies.sendMessage.getCall(0).args[0];
        assertEquals(0, message.indexOf('CROSS_LESSON_REQUEST:'));
        var dataRaw = message.replace('CROSS_LESSON_REQUEST:','');
        var dataJson = JSON.parse(dataRaw);

        assertEquals('testLesson', dataJson.lessonID);
        assertEquals('1234567', dataJson.courseID);
        assertEquals('xQNFEDISERT', dataJson.page);
        assertEquals('lesson', dataJson.type);
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
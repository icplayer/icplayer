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
            sendExternalEvent: sinon.spy()
        };

        this.presenter.playerController = {
            sendExternalEvent: this.spies.sendExternalEvent
        };

        this.presenter.setVisibility = this.spies.setVisibility;
    },

    'test given correct model when requestCrossLesson is called then send message with correct request': function () {
        this.presenter.executeCommand('requestCrossLesson');
        this.presenter.requestCrossLesson();
        var rawData = this.spies.sendExternalEvent.getCall(0).args[1];
        var dataJson = JSON.parse(rawData);

        assertTrue(this.spies.sendExternalEvent.calledOnce);
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

TestCase("Commands", {
    setUp: function () {
        this.presenter = AddonFile_Sender_create();
        this.presenter.configuration = {
            isValid: true
        };
        this.stubs = {
            onSendFileClick: sinon.stub(this.presenter, "onSendFileClick")
        };
    },

    'test when showTeacherList called then onSendFileClick is called': function () {
        this.presenter.showTeacherList();

        assertTrue(this.stubs.onSendFileClick.calledOnce);
    }
});
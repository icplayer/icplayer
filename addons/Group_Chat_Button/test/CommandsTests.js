TestCase("[Group Chat Button] Commands", {
    setUp: function () {
        this.presenter = AddonCross_Lesson_create();
        this.presenter.configuration = {
            title: "123456",
            image: "/file/server/123456"
        };

        this.spies = {
            setVisibility: sinon.spy()
        };

        this.presenter.setVisibility = this.spies.setVisibility;
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
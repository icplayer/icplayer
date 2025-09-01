TestCase("[Text_Selection] GradualShowAnswers tests", {
    setUp: function () {
        this.presenter = AddonText_Selection_create();
        this.presenter.isGradualShowAnswersActive = false;
        this.presenter.showCorrectAnswer = sinon.stub();
        this.presenter.saveAndRemoveSelection = sinon.stub();
        this.presenter.turnOffEventListeners = sinon.stub();
        this.presenter.configuration = { isActivity: true, areEventListenersOn: true, addonID: "Text_Selection1" };
        this.createView();
    },

    createView: function () {
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');
    },

    "test should set isGradualShowAnswersActive to true": function () {
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Text_Selection1'});

        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    "test should call turnOffEventListeners": function () {
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Text_Selection1'});

        assertTrue(this.presenter.turnOffEventListeners.called);
    },

    "test should add disabled class": function () {
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Text_Selection1'});

        assertTrue(this.presenter.$view.find('.text_selection').hasClass("disabled"));
    },

    "test should not set isGradualShowAnswersActive to true if addon is not activity": function () {
        // Checking whether the addon is an activity is performed by GradualShowAnswersService and AddonPresenter.
        // It is not possible to test correctness from the addon .presenter.js code alone.
    },

    "test should not call turnOffEventListeners if addon is not activity": function () {
        // Checking whether the addon is an activity is performed by GradualShowAnswersService and AddonPresenter.
        // It is not possible to test correctness from the addon .presenter.js code alone.
    },

    "test should not add disabled class if addon is not activity": function () {
        // Checking whether the addon is an activity is performed by GradualShowAnswersService and AddonPresenter.
        // It is not possible to test correctness from the addon .presenter.js code alone.
    },
});

TestCase("[Gap Binder] Commands tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();

        this.model = createMixedModelForGapBinderTests();
        this.presenter.readModelItems(this.model.Items);

        this.textModule = createTextModuleForGapBinderTests();
        this.tableModule = createTableModuleForGapBinderTests();

        this.stubs = {
            getModuleStub: sinon.stub(),
        }

        this.stubs.getModuleStub.callsFake((moduleID) => this.getModuleFake(moduleID));
        this.presenter.playerController = {
            getModule: this.stubs.getModuleStub
        };
    },

    getModuleFake: function (moduleID) {
        return moduleID === "Text1"
            ? this.textModule
            : this.tableModule;
    },

    stubGetMaxScore: function (returnedValue) {
        let stub = sinon.stub();
        stub.returns(returnedValue);
        this.presenter.getMaxScore = stub;
    },

    stubGetScore: function (returnedValue) {
        let stub = sinon.stub();
        stub.returns(returnedValue);
        this.presenter.getScore = stub;
    },

    resetAllGaps: function () {
        this.setGapValue(this.textModule, 0, "");
        this.setGapValue(this.textModule, 1, "");
        this.setGapValue(this.textModule, 2, "");
        this.setGapValue(this.tableModule, 0, "");
        this.setGapValue(this.tableModule, 1, "");
        this.setGapValue(this.tableModule, 2, "");
    },

    resetAllGapsAndSetValueToOneOfThem: function () {
        this.setGapValue(this.textModule, 0, "");
        this.setGapValue(this.textModule, 1, "1");
        this.setGapValue(this.textModule, 2, "");
        this.setGapValue(this.tableModule, 0, "");
        this.setGapValue(this.tableModule, 1, "");
        this.setGapValue(this.tableModule, 2, "");
    },

    setGapValue: function (module, gapIndex, newValue) {
        const $view = module.getView();
        const gaps = $view.find(".ic_gap").toArray();
        gaps[gapIndex].value = newValue;
    },

    'test given addon with max score when isAllOk is called then return true': function () {
        this.stubGetMaxScore(6);
        this.stubGetScore(6);

        const result = this.presenter.isAllOK();

        assertTrue(result);
    },

    'test given addon with max score and addon is in show answers mode when isAllOk is called then return true and do not disable show answers mode': function () {
        this.stubGetMaxScore(6);
        this.stubGetScore(6);
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isAllOK();

        assertTrue(this.presenter.isShowAnswersActive);
        assertTrue(result);
    },

    'test given addon with not max score when isAllOk is called then return false': function () {
        this.stubGetMaxScore(6);
        this.stubGetScore(5);

        const result = this.presenter.isAllOK();

        assertFalse(result);
    },

    'test given addon with not max score and addon is in show answers mode when isAllOk is called then return false and do not disable show answers mode': function () {
        this.stubGetMaxScore(6);
        this.stubGetScore(5);
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isAllOK();

        assertTrue(this.presenter.isShowAnswersActive);
        assertFalse(result);
    },

    'test given gap with correct value when isOK is called for this gap then return true': function () {
        this.setGapValue(this.textModule, 0, "ans6");

        const result = this.presenter.isOK(1, 1);

        assertTrue(result);
    },

    'test given gap with correct value and addon is in show answers mode when isOK is called for this gap then return true and disable show answers mode': function () {
        this.setGapValue(this.textModule, 0, "ans6");
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isOK(1, 1);

        assertFalse(this.presenter.isShowAnswersActive);
        assertTrue(result);
    },

    'test given gap with wrong value when isOK is called for this gap then return false': function () {
        this.setGapValue(this.textModule, 0, "wrong answer");

        const result = this.presenter.isOK(1, 1);

        assertFalse(result);
    },

    'test given gap with wrong value and addon is in show answers mode when isOK is called for this gap then return false and disable show answers mode': function () {
        this.setGapValue(this.textModule, 0, "wrong answer");
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isOK(1, 1);

        assertFalse(this.presenter.isShowAnswersActive);
        assertFalse(result);
    },

    'test given addon without filled in gaps when isAttempted is called then return false': function () {
        this.resetAllGaps();

        const result = this.presenter.isAttempted();

        assertFalse(result);
    },

    'test given addon in show answers mode without filled gaps when isAttempted is called then return false and disable show answers mode': function () {
        this.resetAllGaps();
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isAttempted();

        assertFalse(result);
        assertFalse(this.presenter.isShowAnswersActive);
    },

    'test given addon with filled one gap when isAttempted is called then return true': function () {
        this.resetAllGapsAndSetValueToOneOfThem();

        const result = this.presenter.isAttempted();

        assertTrue(result);
    },

    'test given addon in show answers mode with filled one gap when isAttempted is called then return true and disable show answers mode': function () {
        this.resetAllGapsAndSetValueToOneOfThem();
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const result = this.presenter.isAttempted();

        assertTrue(result);
        assertFalse(this.presenter.isShowAnswersActive);
    },
});

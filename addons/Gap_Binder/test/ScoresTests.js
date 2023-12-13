function createMixedModelForGapBinderTests() {
    return {
        Items: [
            {
                Modules: "Text1, Table1",
                Answers: "ans1\nans2\nans3\nans4\nans5\nans6"
            }
        ]
    };
}

function createTextModuleForGapBinderTests() {
    const $view = $(`<div class="ic_text" id="Text1" lang="" style="width: 850px; height: 75px; position: absolute; left: 50px; top: 25px;" aria-hidden="false">Summary:<div><input id="0IftAd-1" type="edit" data-gap="editable" size="9" class="ic_gap" style="width: 150px;"> + <input id="0IftAd-2" type="edit" data-gap="editable" size="15" class="ic_gap" style="width: 150px;"> + <input id="0IftAd-3" type="edit" data-gap="editable" size="15" class="ic_gap" style="width: 150px;">=&nbsp; 8.</div></div>`);
    const gaps = $view.find(".ic_gap").toArray();
    gaps[0].value = "ans1";
    gaps[1].value = "wrong answer";
    gaps[2].value = "wrong answer 2";
    return {
        getView: function () {
            return $view;
        },
        disableGap: function (index) {},
        enableGap: function (index) {},
    }
}

function createTableModuleForGapBinderTests() {
    const $view = $(`<div class="addon_Table" id="Table1" style="width: 397px; height: 150px; position: absolute; left: 50px; top: 25px; visibility: visible;"><div class="table-addon-wrapper"><table><tbody><tr><td class="table_cell row_1 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;">ID</td><td class="table_cell row_1 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;">Value</td></tr><tr><td class="table_cell row_2 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;">Row 1</td><td class="table_cell row_2 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;"><input type="text" value="" id="Table1-1" class="ic_gap" size="1"></td></tr><tr><td class="table_cell row_3 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;">Row 2</td><td class="table_cell row_3 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;"><input type="text" value="" id="Table1-2" class="ic_gap" size="1"></td></tr><tr><td class="table_cell row_4 col_1" colspan="1" rowspan="1" style="width: auto; height: auto;">Row 2</td><td class="table_cell row_4 col_2" colspan="1" rowspan="1" style="width: auto; height: auto;"><input type="text" value="" id="Table1-2" class="ic_gap" size="1"></td></tr></tbody></table></div></div>`);
    const gaps = $view.find(".ic_gap").toArray();
    gaps[0].value = "ans2";
    gaps[1].value = "wrong answer";
    gaps[2].value = "";
    return {
        getView: function () {
            return $view;
        },
        disableGap: function (index) {},
        enableGap: function (index) {},
    }
}

TestCase("[Gap Binder] Scores tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();

        this.model = createMixedModelForGapBinderTests();
        this.presenter.readModelItems(this.model.Items);

        this.textModule = createTextModuleForGapBinderTests();
        this.tableModule = createTableModuleForGapBinderTests();

        this.stubs = {
            getModuleStub: sinon.stub()
        }
        this.stubs.getModuleStub.callsFake((moduleID) => this.getModuleFake(moduleID));
        this.presenter.playerController = {
            getModule: this.stubs.getModuleStub
        }
    },

    getModuleFake: function (moduleID) {
        return moduleID === "Text1"
            ? this.textModule
            : this.tableModule;
    },

    'test given addon in work mode when getMaxScore is called then return max score': function () {
        const maxScore = this.presenter.getMaxScore();

        assertEquals(6, maxScore);
    },

    'test given addon in work mode when getScore is called then return score': function () {
        const score = this.presenter.getScore();

        assertEquals(2, score);
    },

    'test given addon in show answers mode when getScore is called then return score and do not disable show answers mode': function () {
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const score = this.presenter.getScore();

        assertEquals(2, score);
        assertTrue(this.presenter.isShowAnswersActive);
    },

    'test given addon in work mode when getErrorCount is called then return errors number': function () {
        const errorsNumber = this.presenter.getErrorCount();

        assertEquals(3, errorsNumber);
    },

    'test given addon in show answers mode when getErrorCount is called then return number of errors and do not show answers mode': function () {
        this.presenter.showAnswers();
        assertTrue(this.presenter.isShowAnswersActive);

        const errorsNumber = this.presenter.getErrorCount();

        assertEquals(3, errorsNumber);
        assertTrue(this.presenter.isShowAnswersActive);
    },
});

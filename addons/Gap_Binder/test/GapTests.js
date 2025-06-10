TestCase("[Gap Binder] Gap tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();
        this.presenter.addonID = "Gap_Binder1";
        this.presenter.currentPageIndex = "1111111";
    },

    'test given gap not inside Table when addShowAnswersClass is called then add appropriate class': function () {
        let gap = $("<input class='ic_gap'></input>");
        let text = $("<div class='ic_text' id='Text1'></div>");
        text.append(gap);

        this.presenter.addShowAnswersClass(gap[0]);

        assertTrue(gap.hasClass('ic_gap-correct-answer'));
    },

    'test given filled gap not inside Table when addShowAnswersClass is called then add appropriate class': function () {
        let gap = $("<input class='ic_filled_gap'></input>");
        let text = $("<div class='ic_text' id='Text1'></div>");
        text.append(gap);

        this.presenter.addShowAnswersClass(gap[0]);

        assertTrue(gap.hasClass('ic_filled_gap-correct-answer'));
    },

    'test given gap inside Table when addShowAnswersClass is called then add appropriate class': function () {
        let gap = $("<input class='ic_gap'></input>");
        let table = $("<div class='addon_Table' id='Table1'></div>");
        table.append(gap);

        this.presenter.addShowAnswersClass(gap[0]);

        assertTrue(gap.hasClass('ic_gap-show-answers'));
    },

    'test given filled gap inside Table when addShowAnswersClass is called then add appropriate class': function () {
        let gap = $("<input class='ic_filled_gap'></input>");
        let table = $("<div class='addon_Table' id='Table1'></div>");
        table.append(gap);

        this.presenter.addShowAnswersClass(gap[0]);

        assertTrue(gap.hasClass('ic_gap-show-answers'));
    },


    'test given gap not inside Table when removeShowAnswersClass is called then remove appropriate class': function () {
        let gap = $("<input class='ic_gap ic_gap-correct-answer'></input>");
        let text = $("<div class='ic_text' id='Text1'></div>");
        text.append(gap);

        this.presenter.removeShowAnswersClass(gap[0]);

        assertFalse(gap.hasClass('ic_gap-correct-answer'));
    },

    'test given filled gap not inside Table when removeShowAnswersClass is called then remove appropriate class': function () {
        let gap = $("<input class='ic_filled_gap ic_filled_gap-correct-answer'></input>");
        let text = $("<div class='ic_text' id='Text1'></div>");
        text.append(gap);

        this.presenter.removeShowAnswersClass(gap[0]);

        assertFalse(gap.hasClass('ic_filled_gap-correct-answer'));
    },

    'test given gap inside Table when removeShowAnswersClass is called then remove appropriate class': function () {
        let gap = $("<input class='ic_gap ic_gap-show-answers'></input>");
        let table = $("<div class='addon_Table' id='Table1'></div>");
        table.append(gap);

        this.presenter.removeShowAnswersClass(gap[0]);

        assertFalse(gap.hasClass('ic_gap-show-answers'));
    },

});

TestCase("[Table Of Contents] Upgrade Model", {

    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
        this.stubs = {
            upgradeLangTag: sinon.stub(this.presenter, "upgradeLangTag"),
            upgradeSpeechTexts: sinon.stub(this.presenter, "upgradeSpeechTexts")
        };
    },

    tearDown: function () {
        this.presenter.upgradeLangTag.restore();
        this.presenter.upgradeSpeechTexts.restore();
    },

    "test given empty model when upgrading model then calls upgrade functions": function () {
        this.presenter.upgradeModel({});

        assertTrue(this.stubs.upgradeLangTag.calledOnce);
        assertTrue(this.stubs.upgradeSpeechTexts.calledOnce);
    }
});

TestCase("[Table Of Contents] Upgrade lang tag", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
   },

    "test given empty model when upgrading model then sets empty string to lang attribute": function () {
        var upgradedModel = this.presenter.upgradeLangTag({});

        assertNotUndefined(upgradedModel.langAttribute);
        assertEquals(upgradedModel.langAttribute, "");
    },

    "test given model with LangTag PL when upgrading model then sets PL string to lang attribute": function () {
        var langTag = "PL-pl";
        var upgradedModel = this.presenter.upgradeLangTag({langAttribute: langTag});

        assertNotUndefined(upgradedModel.langAttribute);
        assertEquals(upgradedModel.langAttribute, langTag);
    },
});

TestCase("[Table Of Contents] Upgrade speech texts", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();

        this.expectedEmpty = {
            Title: {Title: ""},
            GoToPage: {GoToPage: ""},
            GoToPageNumber: {GoToPageNumber: ""},
            PagesList: {PagesList: ""},
            Pagination: {Pagination: ""},
            OutOf: {OutOf: ""},
            Selected: {Selected: ""},
        };

        this.expectedEmptyPaginationAndTitle = {
            GoToPage: {GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE},
            GoToPageNumber: {GoToPageNumber: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE_NUMBER},
            PagesList: {PagesList: this.presenter.DEFAULT_TTS_PHRASES.PAGES_LIST},
            OutOf: {OutOf: this.presenter.DEFAULT_TTS_PHRASES.OUT_OFF},
            Selected: {Selected: this.presenter.DEFAULT_TTS_PHRASES.SELECTED},
            Title: {Title: ""},
            Pagination: {Pagination: ""},
        };
    },

    "test given empty model when upgrading model then sets empty object to speech text": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, this.expectedEmpty);
    },

    "test given valid input model when upgrading model then sets correct object to speech text": function () {
        var inputModel = {
            speechTexts: {
                Title: {Title: this.presenter.DEFAULT_TTS_PHRASES.TITLE},
                GoToPage: {GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE},
                GoToPageNumber: {GoToPageNumber: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE_NUMBER},
                PagesList: {PagesList: this.presenter.DEFAULT_TTS_PHRASES.PAGES_LIST},
                Pagination: {Pagination: this.presenter.DEFAULT_TTS_PHRASES.PAGINATION},
                OutOf: {OutOf: this.presenter.DEFAULT_TTS_PHRASES.OUT_OFF},
                Selected: {Selected: this.presenter.DEFAULT_TTS_PHRASES.SELECTED},
              }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotEquals(upgradedModel.speechTexts, this.expectedEmpty);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },

    "test given not fully completed model by speech texts when upgrading model then sets correct object to speech text": function () {
        var inputModel = {
            speechTexts: {
                GoToPage: {GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE},
                GoToPageNumber: {GoToPageNumber: this.presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE_NUMBER},
                PagesList: {PagesList: this.presenter.DEFAULT_TTS_PHRASES.PAGES_LIST},
                OutOf: {OutOf: this.presenter.DEFAULT_TTS_PHRASES.OUT_OFF},
                Selected: {Selected: this.presenter.DEFAULT_TTS_PHRASES.SELECTED},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotEquals(upgradedModel.speechTexts, this.expectedEmpty);
        assertEquals(upgradedModel.speechTexts, this.expectedEmptyPaginationAndTitle);
    },
});

TestCase("[Hierarchical Table Of Contents] Upgrade Model", {

    setUp: function () {
        this.presenter = AddonHierarchical_Table_Of_Contents_create();
    },

    "test given empty model when upgrading model then sets empty string to lang attribute": function () {
        var upgradedModel = this.presenter.upgradeLangTag({});

        assertNotUndefined(upgradedModel.langAttribute);
        assertEquals(upgradedModel.langAttribute, "");
    },

    "test given model with custom LangTag when upgrading model then sets custom LangTag to lang attribute": function () {
        var langTag = "myLangTag";
        var upgradedModel = this.presenter.upgradeLangTag({langAttribute: langTag});

        assertEquals(upgradedModel.langAttribute, langTag);
    },

    "test given empty model when upgrading speech texts then sets correct speech texts": function () {
        const expected = {
            Title: {Title: ""},
            GoToPage: {GoToPage: ""},
            Chapter: {Chapter: ""},
            Expanded: {Expanded: ""},
            Collapsed: {Collapsed: ""},
        };

        const upgradedModel = this.presenter.upgradeModel({});

        assertEquals(upgradedModel.speechTexts, expected);
    },

    "test given valid input model when upgrading model then sets correct object to speech text": function () {
        const inputModel = {
            speechTexts: {
                Title: {Title: this.presenter.DEFAULT_TTS_PHRASES.Title},
                GoToPage: {GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GoToPage},
                Chapter: {Chapter: this.presenter.DEFAULT_TTS_PHRASES.Chapter},
                Expanded: {Expanded: this.presenter.DEFAULT_TTS_PHRASES.Expanded},
                Collapsed: {Collapsed: this.presenter.DEFAULT_TTS_PHRASES.Collapsed},
              }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },

    "test given incomplete speech texts model when upgrading model then sets correct object to speech text": function () {
        const expectedModel = {
            speechTexts: {
                Title: {Title: ""},
                GoToPage: {GoToPage: ""},
                Chapter: {Chapter: "My chapter"},
                Expanded: {Expanded: this.presenter.DEFAULT_TTS_PHRASES.Expanded},
                Collapsed: {Collapsed: ""},
              }
        };

        const inputModel = {
            speechTexts: {
                Chapter: {Chapter: "My chapter"},
                Expanded: {Expanded: this.presenter.DEFAULT_TTS_PHRASES.Expanded},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);

        assertEquals(expectedModel.speechTexts, upgradedModel.speechTexts);
    },

    "test given incomplete speech texts model when setting speech text then sets correct custom values to speech text": function () {

        const expectedSpeechTexts = {
            Title: this.presenter.DEFAULT_TTS_PHRASES.Title,
            GoToPage: this.presenter.DEFAULT_TTS_PHRASES.GoToPage,
            Chapter: "My chapter",
            Expanded: "Expansion",
            Collapsed: this.presenter.DEFAULT_TTS_PHRASES.Collapsed,
        };

        const inputModel = {
            speechTexts: {
                Chapter: {Chapter: "My chapter"},
                Expanded: {Expanded: "Expansion"},
            }
        };

        const upgradedModel = this.presenter.upgradeModel(inputModel);
        this.presenter.setSpeechTexts(upgradedModel["speechTexts"]);

        assertEquals(expectedSpeechTexts, this.presenter.speechTexts);
    },

    "test given empty model when upgrading depth of expand then sets correct depth of expand": function () {
        const upgradedModel = this.presenter.upgradeDepthOfExpand({});

        assertNotUndefined(upgradedModel.expandDepth);
        assertEquals(upgradedModel.expandDepth, "");
    },

    "test given model with custom expandDepth when upgrading model then sets custom expandDepth to DoE attribute": function () {
        const expandDepth = "2";
        const upgradedModel = this.presenter.upgradeDepthOfExpand({expandDepth: expandDepth});

        assertEquals(upgradedModel.expandDepth, expandDepth);
    },

});

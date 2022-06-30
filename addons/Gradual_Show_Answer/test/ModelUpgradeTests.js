TestCase("[Gradual Show Answer] Model upgrade", {

    setUp: function () {
        this.presenter = AddonGradual_Show_Answer_create();

        this.model = {
          "ID": "Gradual_Show_Answer1",
        }
    },

    "test given model without set worksWith when upgradeModel is called then worksWith is added with default value": function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["worksWith"]);
        assertEquals('', upgradedModel["worksWith"]);
    },

    "test given model with set worksWith when upgradeModel is called then worksWith value remains unchanged": function () {
        this.model["worksWith"] = "crossword1";

        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertNotUndefined(upgradedModel["worksWith"]);
        assertEquals("crossword1", upgradedModel["worksWith"]);
    },
});

TestCase("[Gradual Show Answer] Upgrade model - speech texts", {

    setUp: function () {
        this.presenter = AddonGradual_Show_Answer_create();
    },

    "test given model without set speech texts when upgrading model using empty object then set empty values to speech texts": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        const expectedSpeechTexts = {
            AnswerHasBeenShown: {AnswerHasBeenShown: ""},
            AnswersAreHidden: {AnswersAreHidden: ""},
            NoNewAnswerToShow: {NoNewAnswerToShow: ""},
            EditionIsBlocked: {EditionIsBlocked: ""},
            EditionIsNotBlocked: {EditionIsNotBlocked: ""},
            Disabled: {Disabled: ""},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model using object with defined speech texts then speech texts have values form given model": function () {
        var inputModel = {
            speechTexts: {
                AnswerHasBeenShown: {AnswerHasBeenShown: "Jedna odpowiedż zotała pokazana"},
                NoNewAnswerToShow: {NoNewAnswerToShow: "Brak nowej odpowiedzi do pokazania"},
                Disabled: {Disabled: "Zablokowany"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        const expectedSpeechTexts = {
            AnswerHasBeenShown: {AnswerHasBeenShown: "Jedna odpowiedż zotała pokazana"},
            AnswersAreHidden: {AnswersAreHidden: ""},
            NoNewAnswerToShow: {NoNewAnswerToShow: "Brak nowej odpowiedzi do pokazania"},
            EditionIsBlocked: {EditionIsBlocked: ""},
            EditionIsNotBlocked: {EditionIsNotBlocked: ""},
            Disabled: {Disabled: "Zablokowany"},
        };
        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, expectedSpeechTexts);
    },

    "test given model without set speech texts when upgrading model with full defined speech texts then all speech texts have values from given model": function () {
        var inputModel = {
            speechTexts: {
                AnswerHasBeenShown: {AnswerHasBeenShown: "Jedna odpowiedż zotała pokazana"},
                AnswersAreHidden: {AnswersAreHidden: "Odpowiedzi są schowane"},
                NoNewAnswerToShow: {NoNewAnswerToShow: "Brak nowej odpowiedzi do pokazania"},
                EditionIsBlocked: {EditionIsBlocked: "Edycja na stronie jest zablokowana"},
                EditionIsNotBlocked: {EditionIsNotBlocked: "Edycja na stronie nie jest zablokowana"},
                Disabled: {Disabled: "Zablokowany"},
            }
        };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});

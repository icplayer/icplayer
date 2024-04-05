TestCase('[FlashCards] validate model tests', {
    setUp: function () {
        this.presenter = AddonFlashCards_create();
        this.model = {
            'ID': 'Flash Cards',
            'IsActivity': 'True',
            'Is Visible': 'True'
        };
    },

    'test given model when validateModel was called should return validated model': function () {
        var mockResult = {
            isValid: true,
			isVisible: true,
            noLoop: false,
			Favourites: false,
			HidePrevNext: false,
            ShowButtons: false,
			IsActivity: true,
            currentCard: 1,
            cardsScore: [],
            cardsFavourites: [],
			addonID: 'Flash Cards',
            randomizeOrder: false,
            sendEventOnCardChanged: false
        };

        var result = this.presenter.validateModel(this.model);

        assertEquals(JSON.stringify(result), JSON.stringify(mockResult));
    },

    'test given model and current card number when validateModel was called should return the model with the card number': function () {
        this.presenter.configuration['currentCard'] = 10

        var currentCard = this.presenter.validateModel(this.model).currentCard;

        assertEquals(currentCard, 10);
    },

    'test given model with langTag when validateModel is called then set lang tag value correctly': function () {
        let expectedValue = "en";
        this.model["langAttribute"] = expectedValue;

        var actualValue = this.presenter.validateModel(this.model).langTag;

        assertEquals(expectedValue, actualValue);
    },

    'test given model with speech texts when validateModel is called then speech texts are set correctly': function () {
            let expectedValues = {
                card: "Karta",
                outOf: "z",
                favourite: "Fav",
                audio: "nagranie",
                correct: "Right",
                wrong: "Left",
                reset: "Reset test",
                selected: "Selection",
                deselected: "Odznaczony",
                cardHasBeenReset: "Card reset",
                turned: "Odwrócony"
            };
            this.model["speechTexts"] = {};
            this.model["speechTexts"]["card"] = {card: expectedValues.card};
            this.model["speechTexts"]["outOf"] = {outOf: expectedValues.outOf};
            this.model["speechTexts"]["favourite"] = {favourite: expectedValues.favourite};
            this.model["speechTexts"]["audio"] = {audio: expectedValues.audio};
            this.model["speechTexts"]["correct"] = {correct: expectedValues.correct};
            this.model["speechTexts"]["wrong"] = {wrong: expectedValues.wrong};
            this.model["speechTexts"]["reset"] = {reset: expectedValues.reset};
            this.model["speechTexts"]["selected"] = {selected: expectedValues.selected};
            this.model["speechTexts"]["deselected"] = {deselected: expectedValues.deselected};
            this.model["speechTexts"]["cardHasBeenReset"] = {cardHasBeenReset: expectedValues.cardHasBeenReset};
            this.model["speechTexts"]["turned"] = {turned: expectedValues.turned};

            this.presenter.validateModel(this.model);

            assertEquals(expectedValues.card, this.presenter.speechTexts.card);
            assertEquals(expectedValues.outOf, this.presenter.speechTexts.outOf);
            assertEquals(expectedValues.favourite, this.presenter.speechTexts.favourite);
            assertEquals(expectedValues.audio, this.presenter.speechTexts.audio);
            assertEquals(expectedValues.correct, this.presenter.speechTexts.correct);
            assertEquals(expectedValues.wrong, this.presenter.speechTexts.wrong);
            assertEquals(expectedValues.reset, this.presenter.speechTexts.reset);
            assertEquals(expectedValues.selected, this.presenter.speechTexts.selected);
            assertEquals(expectedValues.deselected, this.presenter.speechTexts.deselected);
            assertEquals(expectedValues.cardHasBeenReset, this.presenter.speechTexts.cardHasBeenReset);
            assertEquals(expectedValues.turned, this.presenter.speechTexts.turned);
        }
});

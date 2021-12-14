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
			addonID: 'Flash Cards'
        };

        var result = this.presenter.validateModel(this.model);

        assertEquals(JSON.stringify(result), JSON.stringify(mockResult));
    },

    'test given model and current card number when validateModel was called should return the model with the card number': function () {
        this.presenter.configuration['currentCard'] = 10

        var currentCard = this.presenter.validateModel(this.model).currentCard;

        assertEquals(currentCard, 10);
    }
});

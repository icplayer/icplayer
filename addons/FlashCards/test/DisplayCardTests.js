TestCase('[FlashCards] testing displayCard function', {
    setUp: function () {
        this.presenter = AddonFlashCards_create();
        this.model = {
            'ID': 'Flash Cards',
            'IsActivity': 'True',
            'Is Visible': 'True',
            'Cards': [
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': 'Apple',
                    'Front': ''
                }
            ]
        };

        this.stubs = {
            renderMathJax: sinon.stub()
        };
        this.presenter.renderMathJax = this.stubs.renderMathJax;

        this.view = $("<div></div>");
        this.view.addClass('flashcards-wrapper');
        this.view.html(getMockedView());
    },

    'test given no loop state and first card when displayCard was called then disable prev flashcard': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.noLoop = true;

        this.presenter.displayCard(1);

        assertTrue($(this.presenter.flashcardsPrev.get(0)).prop('disabled'));
    },

    'test given no loop state and card number equals all cards when displayCard was called then disable next flashcard': function () {
        this.model = {
            'Cards': [
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': 'Apple',
                    'Front': ''
                },
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': 'Pear',
                    'Front': ''
                }
            ]
        };
        this.presenter.init(this.view, this.model);
        this.presenter.state.noLoop = true;
        this.presenter.state.totalCards = 2;

        this.presenter.displayCard(2);

        assertTrue($(this.presenter.flashcardsNext.get(0)).prop('disabled'));
    },

    'test given cards score when displayCard was called then update correct score button': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.cardsScore = [1, 1];

        this.presenter.displayCard(1);

        assertTrue(this.presenter.flashcardsButtonCorrect.hasClass('flashcards-button-selected'));
    },

    'test given cards score when displayCard was called then update wrong score button': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.cardsScore = [-1, -1];

        this.presenter.displayCard(1);

        assertTrue(this.presenter.flashcardsButtonWrong.hasClass('flashcards-button-selected'));
    },

    'test given favourites cards when displayCard was called then add class to button': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.cardsFavourites = [true, true];

        this.presenter.displayCard(1);

        assertTrue(this.presenter.flashcardsButtonFavourite.hasClass('flashcards-button-selected'));
    },

    'test given AudioFront when displayCard was called then set audio front path': function () {
        $(this.presenter.audioElementFront).attr('src', '');
        this.model.Cards = [
            {
                'AudioBack': 'some/fake/path',
                'AudioFront': 'audio_front',
                'Back': 'AppleBack',
                'Front': 'AppleFront'
            }
        ]
        this.presenter.init(this.view, this.model);

        this.presenter.displayCard(1);
        var frontPath = $(this.presenter.audioElementFront).prop('src')

        assertTrue(frontPath.includes('audio_front'));
    },

    'test given AudioBack when displayCard was called then set audio front path': function () {
        $(this.presenter.audioElementBack).attr('src', '');
        this.model.Cards = [
            {
                'AudioBack': 'audio_back',
                'AudioFront': 'audio_front',
                'Back': 'AppleBack',
                'Front': 'AppleFront'
            }
        ]
        this.presenter.init(this.view, this.model);

        this.presenter.displayCard(1);
        var frontPath = $(this.presenter.audioElementBack).prop('src')

        assertTrue(frontPath.includes('audio_back'));
    }
});

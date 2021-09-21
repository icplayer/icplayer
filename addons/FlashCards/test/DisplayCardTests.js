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
        this.view = $("<div></div>");
        this.view.addClass('flashcards-wrapper');
        this.view.html(
            "<div class=\"flashcards-main\">" +
            "<div class=\"flashcards-prev-wrapper\">" +
            "<button type=\"button\" class=\"flashcards-prev\"></button>" +
            "<button type=\"button\" class=\"flashcards-next\"></button>" +
            "</div>" +
            "<div class=\"flashcards-card\">" +
            "<div class=\"flashcards-card-front\">" +
            "<div class=\"flashcards-card-contents flashcards-card-contents-front\"><img src=\"//www.mauthor.com/file/serve/5593019455766528\"></div>" +
            "<div class=\"flashcards-card-audio-wrapper flashcards-card-audio-wrapper-front\" style=\"display: none;\">" +
            "<audio class=\"flashcards-card-audio flashcards-card-audio-front\" src=\"\"></audio>" +
            "<div class=\"flashcards-card-audio-button flashcards-card-audio-button-front disabled\"></div>" +
            "</div></div>" +
            "<div class=\"flashcards-card-back\">" +
            "<div class=\"flashcards-card-contents flashcards-card-contents-back\" style=\"display: none;\">Apple</div>" +
            "<div class=\"flashcards-buttons\">" +
            "<div class=\"flashcards-button flashcards-button-wrong\"></div>" +
            "<div class=\"flashcards-button flashcards-button-reset\"></div>" +
            "<div class=\"flashcards-button flashcards-button-correct\"></div>" +
            "</div>" +
            "<div class=\"flashcards-card-audio-wrapper flashcards-card-audio-wrapper-back\" style=\"display: block;\">" +
            "<audio class=\"flashcards-card-audio flashcards-card-audio-back\" src=\"//www.mauthor.com/file/serve/5249777514184704\"></audio>" +
            "<div class=\"flashcards-card-audio-button flashcards-card-audio-button-back\"></div>" +
            "</div></div><div class=\"flashcards-button-favourite\"></div></div>" +
            "<div class=\"flashcards-prev-wrapper\"></div>" +
            "</div>" +
            "<div class=\"flashcards-panel\">1/1</div>"
        );
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

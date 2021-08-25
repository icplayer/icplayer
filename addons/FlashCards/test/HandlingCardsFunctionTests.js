TestCase('[FlashCards] handling Flash Cards function', {
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
        this.view = "<div class=\"flashcards-wrapper\">" +
            "<div class=\"flashcards-main\">" +
            "<div class=\"flashcards-prev-wrapper\">" +
            "<button type=\"button\" class=\"flashcards-prev\"></button>" +
            "</div>" +
            "<div class=\"flashcards-card\">" +
            "<div class=\"flashcards-card-front\">" +
            "<div class=\"flashcards-card-contents flashcards-card-contents-front\"><img src=\"//www.mauthor.com/file/serve/5593019455766528\"></div>" +
            "<div class=\"flashcards-card-audio-wrapper flashcards-card-audio-wrapper-front\" style=\"display: none;\">" +
            "<audio class=\"flashcards-card-audio flashcards-card-audio-front\" src=\"\"></audio>" +
            "<div class=\"flashcards-card-audio-button flashcards-card-audio-button-front disabled\"></div>" +
            "</div>" +
            "</div>" +
            "<div class=\"flashcards-card-back\">" +
            "<div class=\"flashcards-card-contents flashcards-card-contents-back\" style=\"display: none;\">Apple</div>" +
            "<div class=\"flashcards-buttons\">" +
            "<div class=\"flashcards-button flashcards-button-wrong\">" +
            "</div>" +
            "<div class=\"flashcards-button flashcards-button-reset\">" +
            "</div>" +
            "<div class=\"flashcards-button flashcards-button-correct\">" +
            "</div>" +
            "</div>" +
            "<div class=\"flashcards-card-audio-wrapper flashcards-card-audio-wrapper-back\" style=\"display: block;\">" +
            "<audio class=\"flashcards-card-audio flashcards-card-audio-back\" src=\"//www.mauthor.com/file/serve/5249777514184704\"></audio>" +
            "<div class=\"flashcards-card-audio-button flashcards-card-audio-button-back\"></div>" +
            "</div>" +
            "</div>" +
            "<div class=\"flashcards-button-favourite\"></div>" +
            "</div>" +
            "<div class=\"flashcards-prev-wrapper\">" +
            "<button type=\"button\" class=\"flashcards-next\"></button>" +
            "</div>" +
            "</div>" +
            "<div class=\"flashcards-panel\">1/1</div>" +
            "</div>";

        this.spies = {
            'validateModelSpy': sinon.spy(this.presenter, 'validateModel'),
            'showCardSpy': sinon.spy(this.presenter, 'showCard'),
            'addClickHandlersSpy': sinon.spy(this.presenter, 'addClickHandlers')
        }
    },

    'test given model and view when init was called should prepare values': function () {
        this.presenter.init(this.view, this.model);

        assertTrue('Validate model', this.spies.validateModelSpy.called);
        assertTrue('Show first card', this.spies.showCardSpy.calledWith(1));
        assertTrue('Validate model', this.spies.addClickHandlersSpy.called);
    },

    'test given cards when countFavourites was called should return only favourites cards': function () {
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.state.cardsFavourites = [true, true, false, true];

        var favourites = this.presenter.countFavourites();

        assertEquals(favourites, 3);
    },

    'test given cards when countNonFavouritesBefore was called should return only favourites cards': function () {
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.state.cardsFavourites = [true, true, false, true];

        var unfavourites = this.presenter.countNonFavouritesBefore(4);

        assertEquals(unfavourites, 1);
    },

    'test should revert card when revertCard was called': function () {
        this.presenter.flashcardsCardAudioButtonFront = $(document.createElement('div'));
        this.presenter.flashcardsCardAudioButtonFront.addClass('playing');
        this.presenter.flashcardsCardAudioButtonBack = $(document.createElement('div'));
        this.presenter.flashcardsCardAudioButtonBack.addClass('playing');
        assertTrue(this.presenter.flashcardsCardAudioButtonFront[0].classList.contains('playing'));
        assertTrue(this.presenter.flashcardsCardAudioButtonBack[0].classList.contains('playing'));
    }
});

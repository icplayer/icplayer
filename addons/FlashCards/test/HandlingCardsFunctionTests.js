function getMockedView() {
    return "<div class=\"flashcards-main\">" +
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
        "<div class='flashcards-card-audio-wrapper flashcards-card-audio-wrapper-hidden'>" +
        "<audio class='flashcards-card-audio flashcards-card-audio-hidden' src=\"//www.mauthor.com/file/serve/5249777514184704\"></audio></div>" +
        "<div class=\"flashcards-prev-wrapper\"></div>" +
        "</div>" +
        "<div class=\"flashcards-panel\">1/1</div>";
}

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
        this.view = $("<div></div>");
        this.view.addClass('flashcards-wrapper');
        this.view.html(getMockedView());

        this.stubs = {
            renderMathJax: sinon.stub(),
            parseAltTexts: sinon.stub()
        };
        this.presenter.renderMathJax = this.stubs.renderMathJax;
        this.presenter.eventBus = {sendEvent: sinon.mock()};
        this.presenter.textParser = {
            parseAltTexts: this.stubs.parseAltTexts
        };
        this.presenter.textParser.parseAltTexts.returnsArg(0);

        this.spies = {
            'validateModelSpy': sinon.spy(this.presenter, 'validateModel'),
            'showCardSpy': sinon.spy(this.presenter, 'showCard'),
            'addClickHandlersSpy': sinon.spy(this.presenter, 'addClickHandlers'),
            'updateVisibilitySpy': sinon.spy(this.presenter, 'updateVisibility')
        };
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

        this.presenter.generateCardMap();
        var unfavourites = this.presenter.countNonFavouritesBefore(4);

        assertEquals(unfavourites, 1);
    },

    'test given flash cards when revertCard was called should revert card': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.flashcardsCardAudioButtonFront = $(document.createElement('div'));
        this.presenter.flashcardsCardAudioButtonFront.addClass('playing');
        this.presenter.flashcardsCardAudioButtonBack = $(document.createElement('div'));
        this.presenter.flashcardsCardAudioButtonBack.addClass('playing');
        this.presenter.audioElementFront = {
            pause: sinon.mock()
        }
        this.presenter.audioElementBack = {
            pause: sinon.mock()
        }

        this.presenter.revertCard();

        assertFalse(this.presenter.flashcardsCardAudioButtonFront[0].classList.contains('playing'));
        assertFalse(this.presenter.flashcardsCardAudioButtonBack[0].classList.contains('playing'));
        assertFalse(this.presenter.isFrontPlaying);
        assertFalse(this.presenter.isBackPlaying);
    },

    'test given current card number equal 3 when prevCard was called should show second card': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.currentCard = 3;
        this.presenter.state.noLoop = true;
        sinon.stub(this.presenter, 'displayCard');

        this.presenter.prevCard();

        assertTrue(this.spies.showCardSpy.calledWith(2));
    },

    'test given second card when nextCard was called should show third card': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.currentCard = 2;
        this.presenter.state.totalCards = 5;
        this.presenter.state.noLoop = true;
        sinon.stub(this.presenter, 'displayCard');

        this.presenter.nextCard(false);

        assertTrue(this.spies.showCardSpy.calledWith(3));
    },

    'test given first card when showCard was called should display first card': function () {
        this.presenter.init(this.view, this.model);
        var displayCardSpy = sinon.spy(this.presenter, 'displayCard');

        this.presenter.showCard(1);

        assertTrue(displayCardSpy.calledWith(1));
    },

    'test given favourites cards when showOnlyFavourites was called should show current card': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.ShowOnlyFavourites = false;
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.state.cardsFavourites = [true, true, false, true];
        this.presenter.state.currentCard = 2;

        this.presenter.showOnlyFavourites();

        assertTrue(this.spies.showCardSpy.calledWith(2));
        assertTrue(this.presenter.state.ShowOnlyFavourites);
    },

    'test given unfavourite cards when showAllCards was called should show current card ': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.ShowOnlyFavourites = true;
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.state.cardsFavourites = [false, false, false, false];
        this.presenter.state.currentCard = 1;

        this.presenter.showAllCards();

        assertTrue(this.spies.showCardSpy.calledWith(1));
        assertFalse(this.presenter.state.ShowOnlyFavourites);
    },

    'test should make all cards unfavourite when resetFavourites was called': function () {
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.state.cardsFavourites = [true, true, false, true];
        this.presenter.state.ShowOnlyFavourites = true;

        this.presenter.resetFavourites();
        var allAreUnfavourite = this.presenter.state.cardsFavourites.every(card => !card);

        assertTrue(allAreUnfavourite);
        assertFalse(this.presenter.state.ShowOnlyFavourites);
    },

    'test set up defaults value when reset was called': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.Cards = [
            {'name': 'first fake card'},
            {'name': 'second fake card'},
            {'name': 'third fake card'},
            {'name': 'fourth fake card'}
        ];
        this.presenter.cardMap = [0,1,2,3];
        this.presenter.model.Cards = this.presenter.Cards;
        this.presenter.state.cardsFavourites = [true, true, true, false];
        this.presenter.state.cardsScore = [1, 0, 0, 1];
        this.presenter.state.currentCard = 1;
        this.presenter.configuration.currentCard = 2;

        this.presenter.reset();
        var allScoresAreDefault = this.presenter.state.cardsScore.every(score => score === 0);

        assertTrue(this.spies.updateVisibilitySpy.called);
        assertTrue(allScoresAreDefault);
    },

    'test given card score and activated model when getErrorCount was called should return counting errors': function () {
        this.presenter.configuration.IsActivity = true;
        this.presenter.state.cardsScore = [-1, -1, -1, 1];

        var countingErrors = this.presenter.getErrorCount();

        assertEquals(countingErrors, 3);
    },

    'test given number of cards and activated model when getMaxScore was called should return max score': function () {
        this.presenter.configuration.IsActivity = true;
        this.presenter.state.totalCards = 5;

        var maxScore = this.presenter.getMaxScore();

        assertEquals(maxScore, 5);
    },

    'test given card score and activated model when getScore was called should return number of correct answers': function () {
        this.presenter.configuration.IsActivity = true;
        this.presenter.state.cardsScore = [-1, 1, -1, -1];

        var correctAnswers = this.presenter.getScore();

        assertEquals(correctAnswers, 1);
    },

    'test given state when setState was called should set state and show current card': function () {
        this.presenter.init(this.view, this.model);
        sinon.stub(this.presenter, 'displayCard');
        var newState = '{"state":{"currentCard":3}}';

        this.presenter.setState(newState);

        assertTrue(this.spies.updateVisibilitySpy.called);
        assertTrue(this.spies.showCardSpy.calledWith(3));
    },

    'test given addon when show was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.show();

        assertTrue(this.stubs.renderMathJax.calledOnce);
    },

    'test given addon when nextCard was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.nextCard();

        assertTrue(this.stubs.renderMathJax.calledOnce);
    },

    'test given addon when prevCard was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.prevCard();

        assertTrue(this.stubs.renderMathJax.calledOnce);
    },

    'test given addon with favourites when showOnlyFavourites was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.presenter.state.cardsFavourites = [true];
        this.stubs.renderMathJax.reset();

        this.presenter.showOnlyFavourites();

        assertTrue(this.stubs.renderMathJax.calledOnce);
    },

    'test given addon without favourites when showOnlyFavourites was called then do not renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.showOnlyFavourites();

        assertFalse(this.stubs.renderMathJax.called);
    },

    'test given addon when showAllCards was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.showAllCards();

        assertTrue(this.stubs.renderMathJax.calledOnce);
    },

    'test given addon when reset was called then renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.reset();

        assertTrue(this.stubs.renderMathJax.called);
    },

    'test given addon when resetFavourites was not called then do not renderMathJax': function () {
        this.presenter.init(this.view, this.model);
        this.stubs.renderMathJax.reset();

        this.presenter.resetFavourites();

        assertFalse(this.stubs.renderMathJax.called);
    }
});

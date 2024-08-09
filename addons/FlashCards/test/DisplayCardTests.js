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
            renderMathJax: sinon.stub(),
            parseAltTexts: sinon.stub(),
            parsePreviewAltText: sinon.stub(window.TTSUtils, "parsePreviewAltText")
        };
        this.presenter.renderMathJax = this.stubs.renderMathJax;

        this.view = $("<div></div>");
        this.view.addClass('flashcards-wrapper');
        this.view.html(getMockedView());

        this.presenter.textParser = {
            parseAltTexts: this.stubs.parseAltTexts
        };
        this.stubs.parseAltTexts.returnsArg(0);
        this.stubs.parsePreviewAltText.returnsArg(0);
    },

    tearDown: function () {
        window.TTSUtils.parsePreviewAltText.restore();
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
        var frontPath = $(this.presenter.audioElementFront).prop('src');

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
        var frontPath = $(this.presenter.audioElementBack).prop('src');

        assertTrue(frontPath.includes('audio_back'));
    },

    'test given cards with alt texts when init was called then parse alt text and display first card': function () {
        this.model = {
            'Cards': [
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 1|Alternative back text for card 1}\n' +
                        '\\alt{Back text for card 1|Alternative back text for card 1}[lang pl]',
                    'Front': '\\alt{Front text for card 1|Alternative front text for card 1}\n' +
                        '\\alt{Front text for card 1|Alternative front text for card 1}[lang pl]'
                },
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 2|Alternative back text for card 2}\n' +
                        '\\alt{Back text for card 2|Alternative back text for card 2}[lang pl]',
                    'Front': '\\alt{Front text for card 2|Alternative front text for card 2}\n' +
                        '\\alt{Front text for card 2|Alternative front text for card 2}[lang pl]'
                }
            ]
        };
        const spy = sinon.spy(this.presenter, "displayCard");

        this.presenter.init(this.view, this.model, false);

        assertEquals(1, spy.callCount);
        assertEquals(2, this.stubs.parseAltTexts.callCount);
        assertEquals(this.model.Cards[0].Front, this.stubs.parseAltTexts.getCall(0).args[0]);
        assertEquals(this.model.Cards[0].Back, this.stubs.parseAltTexts.getCall(1).args[0]);
    },

    'test given cards with alt texts when init was called in preview then parse alt text and display first card': function () {
        this.model = {
            'Cards': [
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 1|Alternative back text for card 1}\n' +
                        '\\alt{Back text for card 1|Alternative back text for card 1}[lang pl]',
                    'Front': '\\alt{Front text for card 1|Alternative front text for card 1}\n' +
                        '\\alt{Front text for card 1|Alternative front text for card 1}[lang pl]'
                },
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 2|Alternative back text for card 2}\n' +
                        '\\alt{Back text for card 2|Alternative back text for card 2}[lang pl]',
                    'Front': '\\alt{Front text for card 2|Alternative front text for card 2}\n' +
                        '\\alt{Front text for card 2|Alternative front text for card 2}[lang pl]'
                }
            ]
        };
        const spy = sinon.spy(this.presenter, "displayCard");

        this.presenter.init(this.view, this.model, true);

        assertEquals(1, spy.callCount);
        assertEquals(2, this.stubs.parsePreviewAltText.callCount);
        assertEquals(this.model.Cards[0].Front, this.stubs.parsePreviewAltText.getCall(0).args[0]);
        assertEquals(this.model.Cards[0].Back, this.stubs.parsePreviewAltText.getCall(1).args[0]);
    },

    'test given cards with alt texts when displayCard was called then parse alt text for displayed card': function () {
        this.model = {
            'Cards': [
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 1|Alternative back text for card 1}\n' +
                        '\\alt{Back text for card 1|Alternative back text for card 1}[lang pl]',
                    'Front': '\\alt{Front text for card 1|Alternative front text for card 1}\n' +
                        '\\alt{Front text for card 1|Alternative front text for card 1}[lang pl]'
                },
                {
                    'AudioBack': 'some/fake/path',
                    'AudioFront': '',
                    'Back': '\\alt{Back text for card 2|Alternative back text for card 2}\n' +
                        '\\alt{Back text for card 2|Alternative back text for card 2}[lang pl]',
                    'Front': '\\alt{Front text for card 2|Alternative front text for card 2}\n' +
                        '\\alt{Front text for card 2|Alternative front text for card 2}[lang pl]'
                }
            ]
        };
        this.presenter.init(this.view, this.model, false);
        this.presenter.state.noLoop = true;
        this.presenter.state.totalCards = 2;

        this.stubs.parseAltTexts.resetHistory();

        this.presenter.displayCard(2);

        assertEquals(2, this.stubs.parseAltTexts.callCount);
        assertEquals(this.model.Cards[1].Front, this.stubs.parseAltTexts.getCall(0).args[0]);
        assertEquals(this.model.Cards[1].Back, this.stubs.parseAltTexts.getCall(1).args[0]);
    }
});

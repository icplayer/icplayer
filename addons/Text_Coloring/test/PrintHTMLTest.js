TestCase("[Text_Coloring] get printable HTML", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.model = {
            Bottom: '',
            ID: 'Text_Coloring1',
            colors: [
                {color: '#f34444', description: 'red', id: 'red'},
                {color: '#3ba8ed', description: 'blue', id: 'blue'}
            ],
            text: 'Shade difference \\color{red}{red2} \\color{blue}{blue2}'
        };

        this.spies = {
            upgradeModelSpy : sinon.spy(this.presenter, 'upgradeModel'),
            getUserAnswerSpy : sinon.spy(this.presenter, 'getUserAnswer'),
            createHTMLSpy : sinon.spy(this.presenter, 'createHTML')
        };

        this.userAnswer = [
            {isSelected: true, selectionColorID: 'red', value: 'Shade'},
            {isSelected: false, selectionColorID: null, value: 'difference'},
            {isSelected: false, selectionColorID: null, value: 'red2'},
            {isSelected: true, selectionColorID: 'blue', value: 'blue2'}
        ]
    },

    'test should upgrade model when getPrintableHTML was called': function () {
        this.presenter['printableState'] = {tokens: this.userAnswer};
        this.presenter.getPrintableHTML(this.model, false);

        assertTrue(this.spies.upgradeModelSpy.called);
        assertTrue(this.spies.getUserAnswerSpy.called);
        assertTrue(this.spies.createHTMLSpy.called);
    },

    'test should create printable HTML when createHTML was called': function () {
        var htmlContent = 'Example HTML content for Text Coloring addon.';
        var printableHTML = this.presenter.createHTML(false, htmlContent, 100);

        assertTrue(printableHTML.includes(htmlContent));
    },

    'test given user answers and showAnswer on false when getPrintableHTML was called should wrap underscore word': function () {
        this.presenter['printableState'] = {tokens: this.userAnswer};

        var printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes('<span style="border: 2px solid #787878">Shade</span>'))
    },

    'test given showAnswer on true without user answers when getPrintableHTML was called should wrap correct word': function () {
        this.presenter['printableState'] = {};

        var printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes('<span style="border: 2px dashed #787878">red2</span>'))
    },

    'test given showAnswer on true and user answers when getPrintableHTML was called should underscore correct word': function () {
        this.presenter['printableState'] = {tokens: this.userAnswer};

        var printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes('<span style="border-bottom: 1px solid">red2</span>'))
    },

    'test given model when getColors was called should return defined colors in grayscale': function () {
        var mockColors = [
            {'name':'red', 'value':'#787878'},
            {'name':'blue', 'value':'#8f8f8f'}
        ];
        var colors = this.presenter.getColors(this.model);

        assertEquals(colors, mockColors);
    },

    'test given model and color name when getColorInHEX was called should return colors in hex code': function () {
        var colorInHex = this.presenter.getColorInHex(this.model, 'red');

        assertEquals(colorInHex, '#787878');
    },

    'test given user answer and model answer when isAnswerCorrect was called should check correctness of the user answer': function () {
        var modelAnswers = [
            '{red}{red2}',
            '{blue}{blue2}'
        ];
        var userAnswer = {
            selectionColorID: 'red',
            value: 'red2'
        }

        assertTrue(this.presenter.isAnswerCorrect(userAnswer, modelAnswers));
    }


});

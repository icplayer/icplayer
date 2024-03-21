TestCase("[Text_Coloring] get printable HTML - shared methods tests", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.printableState = {};

        this.model = {
            colors: [
                {color: '#f34444', description: 'red', id: 'red'},
                {color: '#3ba8ed', description: 'blue', id: 'blue'}
            ],
            text: "Some text"
        };

        this.spies = {
            upgradeModelSpy : sinon.spy(this.presenter, "upgradeModel"),
            getUserAnswerSpy : sinon.spy(this.presenter, "getUserAnswer"),
            createHTMLSpy : sinon.spy(this.presenter, "createHTML")
        };
    },

    'test should upgrade model when getPrintableHTML was called': function () {
        this.presenter.getPrintableHTML(this.model, false);

        assertTrue(this.spies.upgradeModelSpy.calledOnce);
    },

    'test should use user answers when getPrintableHTML was called': function () {
        this.presenter.getPrintableHTML(this.model, false);

        assertTrue(this.spies.getUserAnswerSpy.calledOnce);
    },

    'test should call createHTML when getPrintableHTML was called': function () {
        this.presenter.getPrintableHTML(this.model, false);

        assertTrue(this.spies.createHTMLSpy.calledOnce);
    },

    'test should create printable HTML when createHTML was called': function () {
        const htmlContent = "Example HTML content for Text Coloring addon.";

        const printableHTML = this.presenter.createHTML(false, htmlContent, 100, this.model);

        assertTrue(printableHTML.includes(htmlContent));
    },

    'test given model when getColors was called should return defined colors in grayscale': function () {
        const mockColors = [
            {'id': 'red', 'value':'#787878'},
            {'id': 'blue', 'value':'#8f8f8f'}
        ];
        const colors = this.presenter.getColors(this.model);

        assertEquals(colors, mockColors);
    },

    'test given model and color name when getColorInHEX was called should return colors in hex code': function () {
        const colorInHex = this.presenter.getColorInHex(this.model, 'red');

        assertEquals(colorInHex, '#787878');
    },

    'test given model when createLegend was called should return legend in HTML markup language': function () {
        const colors = [
            {'description':'red', 'color':'#787878'},
            {'description':'blue', 'color':'#8f8f8f'}
        ];
        const mockLegend = this.presenter.createLegend(colors, 'Testing legend')[0].outerHTML;

        assertTrue(mockLegend.includes('<caption>Testing legend</caption>'));
        assertTrue(mockLegend.includes('red'));
        assertTrue(mockLegend.includes('blue'));
    }
});

TestCase("[Text_Coloring] get printable HTML - MARK_PHRASES mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.printableState = {};

        this.model = {
            colors: [
                {color: '#f34444', description: 'red', id: 'red'},
                {color: '#3ba8ed', description: 'blue', id: 'blue'}
            ],
            Mode: "Mark phrases to select",
            text: "Shade difference \\color{red}{lightRed} \\color{red}{darkRed} \\color{blue}{lightBlue} \\intruder{wrongAnswer} \\intruder{wrongAnswer2}"
        };

        this.userAnswer = [
            {type: "word", value: "Shade", isSelected: false, selectionColorID: null},
            {type: "word", value: "difference", isSelected: false, selectionColorID: null},
            {type: "selectable", value: "lightRed", color: "red", isSelected: true, selectionColorID: "red"},
            {type: "selectable", value: "darkRed", color: "red", isSelected: true, selectionColorID: "blue"},
            {type: "selectable", value: "lightBlue", color: "blue", isSelected: false, selectionColorID: null},
            {type: "intruder", value: "wrongAnswer", isSelected: true, selectionColorID: "blue"},
            {type: "intruder", value: "wrongAnswer2", isSelected: false, selectionColorID: null}
        ];

        this.stubs = {
            getPrintableMarkStub: sinon.stub(this.presenter, "getPrintableMark"),
        };
        this.stubs.getPrintableMarkStub.callsFake(function (isCorrectAnswer) {
            return isCorrectAnswer ? 'A' : 'B';
        });
    },

    tearDown: function () {
        this.presenter.getPrintableMark.restore();
    },

    setUserAnswers: function () {
        this.presenter.printableState = {tokens: this.userAnswer};
    },

    // Clear

    'test clear printable state when getPrintableHTML was called should do nothing for words': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes("Shade difference"));
    },

    'test clear printable state when getPrintableHTML was called should underscore all selectable tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border-bottom: 1px solid">lightRed</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border-bottom: 1px solid">darkRed</span>'));
        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border-bottom: 1px solid">lightBlue</span>'));
    },

    'test clear printable state when getPrintableHTML was called should underscore all intruder tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for wrongAnswer failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer</span>'));
        assertTrue("Test for wrongAnswer2 failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer2</span>'));
    },

    // Show answers

    'test show answers printable state when getPrintableHTML was called should do nothing for words': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes("Shade difference"));
    },

    'test show answers printable state when getPrintableHTML was called should wrap all selectable tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px dashed #787878">lightRed</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px dashed #787878">darkRed</span>'));
        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border: 2px dashed #8f8f8f">lightBlue</span>'));
    },

    'test show answers printable state when getPrintableHTML was called should underscore all intruder tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for wrongAnswer failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer</span>'));
        assertTrue("Test for wrongAnswer2 failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer2</span>'));
    },

    // User answers

    'test user answers printable state when getPrintableHTML was called should do nothing for words': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes("Shade difference"));
    },

    'test user answers printable state when getPrintableHTML was called should wrap selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px solid #787878">lightRed</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">darkRed</span>'));
    },

    'test user answers printable state when getPrintableHTML was called should underscore not selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border-bottom: 1px solid">lightBlue</span>'));
    },

    'test user answers printable state when getPrintableHTML was called should wrap selected intruder token': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for wrongAnswer failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">wrongAnswer</span>'));
    },

    'test user answers printable state when getPrintableHTML was called should underscore not selected intruder token': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for wrongAnswer2 failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer2</span>'));
    },

    // Check answers

    'test check answers printable state when getPrintableHTML was called should do nothing for words': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes("Shade difference"));
    },

    'test check answers printable state when getPrintableHTML was called should wrap selected selectable tokens and add answer mark': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px solid #787878">lightRed A</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">darkRed B</span>'));
    },

    'test check answers printable state when getPrintableHTML was called should underscore not selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border-bottom: 1px solid">lightBlue</span>'));
    },

    'test check answers printable state when getPrintableHTML was called should wrap selected intruder token and add answer mark ': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for wrongAnswer failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">wrongAnswer B</span>'));
    },

    'test check answers printable state when getPrintableHTML was called should underscore not selected intruder token': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for wrongAnswer2 failed", printableHTML.includes('<span style="border-bottom: 1px solid">wrongAnswer2</span>'));
    }
});

TestCase("[Text_Coloring] get printable HTML - ALL_SELECTABLE mode", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.printableState = {};

        this.model = {
            colors: [
                {color: '#f34444', description: 'red', id: 'red'},
                {color: '#3ba8ed', description: 'blue', id: 'blue'}
            ],
            Mode: "All selectable",
            text: "Shade difference \\color{red}{lightRed} \\color{red}{darkRed} \\color{blue}{lightBlue}",
        };

        this.userAnswer = [
            {type: "word", value: "Shade", isSelected: true, selectionColorID: "red"},
            {type: "word", value: "difference", isSelected: false, selectionColorID: null},
            {type: "selectable", value: "lightRed", color: "red", isSelected: true, selectionColorID: "red"},
            {type: "selectable", value: "darkRed", color: "red", isSelected: true, selectionColorID: "blue"},
            {type: "selectable", value: "lightBlue", color: "blue", isSelected: false, selectionColorID: null},
        ];

        this.stubs = {
            getPrintableMarkStub: sinon.stub(this.presenter, "getPrintableMark"),
        };
        this.stubs.getPrintableMarkStub.callsFake(function (isCorrectAnswer) {
            return isCorrectAnswer ? 'A' : 'B';
        });
    },

    tearDown: function () {
        this.presenter.getPrintableMark.restore();
    },

    setUserAnswers: function () {
        this.presenter.printableState = {tokens: this.userAnswer};
    },

    // Clear state

    'test clear printable state when getPrintableHTML was called should do nothing for all tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes("Shade difference lightRed darkRed lightBlue"));
    },

    // Show answers

    'test show answers printable state when getPrintableHTML was called should do nothing for words': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes("Shade difference"));
    },

    'test show answers printable state when getPrintableHTML was called should wrap all selectable tokens': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px dashed #787878">lightRed</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px dashed #787878">darkRed</span>'));
        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border: 2px dashed #8f8f8f">lightBlue</span>'));
    },

    // User answers

    'test user answers printable state when getPrintableHTML was called should wrap selected word': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes(`<span style="border: 2px solid #787878">Shade</span>`));
    },

    'test user answers printable state when getPrintableHTML was called should do nothing for not selected words': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(printableHTML.includes(`</span> difference <span `));
    },

    'test user answers printable state when getPrintableHTML was called should wrap selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px solid #787878">lightRed</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">darkRed</span>'));
    },

    'test user answers printable state when getPrintableHTML was called should do nothing for not selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue("Test for lightBlue failed", printableHTML.includes('</span> lightBlue <'));
    },

    // Check answers

    'test check answers printable state when getPrintableHTML was called should wrap selected word and add answer mark': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes(`<span style="border: 2px solid #787878">Shade B</span>`));
    },

    'test check answers printable state when getPrintableHTML was called should do nothing for not selected words': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(printableHTML.includes(`</span> difference <span `));
    },

    'test check answers printable state when getPrintableHTML was called should wrap selected selectable tokens and add answer mark': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightRed failed", printableHTML.includes('<span style="border: 2px solid #787878">lightRed A</span>'));
        assertTrue("Test for darkRed failed", printableHTML.includes('<span style="border: 2px solid #8f8f8f">darkRed B</span>'));
    },

    'test check answers printable state when getPrintableHTML was called should underscore not selected selectable tokens': function () {
        this.setUserAnswers();

        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue("Test for lightBlue failed", printableHTML.includes('<span style="border-bottom: 1px solid">lightBlue</span>'));
    }
});

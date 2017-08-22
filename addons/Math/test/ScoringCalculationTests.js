TestCase("[Math] Scoring calculation - max score", {
    setUp: function () {
        this.presenter = AddonMath_create();
        sinon.stub(this.presenter, 'getEmptyGaps');
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: [] });
    },

    tearDown: function () {
        this.presenter.getEmptyGaps.restore();
    },

    'test no variables specified': function () {
        this.presenter.configuration = {
            variables: []
        };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test single variable specified': function () {
        this.presenter.configuration = {
            variables: [{ name: 'gap1', value: 'Text1.1' }]
        };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(1, maxScore);
    },

    'test multiple variables specified': function () {
        this.presenter.configuration = {
            variables: [
                { name: 'gap1', value: 'Text1.1' },
                { name: 'gap2', value: 'Text1.2' },
                { name: 'gap3', value: 'Text1.3' }
            ]
        };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(3, maxScore);
    },

    'test not all gaps are filled': function () {
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: ["gap2"] });
        this.presenter.configuration = {
            variables: [
                { name: 'gap1', value: 'Text1.1' },
                { name: 'gap2', value: 'Text1.2' },
                { name: 'gap3', value: 'Text1.3' }
            ]
        };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(3, maxScore);
    }
});

TestCase("[Math] Scoring calculation - score and errors count", {
    setUp: function () {
        this.presenter = AddonMath_create();
        var text1 = {
            getGapValue:function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '3';
                    case '3':
                        return '21';
                    case '4':
                        return '355';
                }
            }
        };

        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(text1);
        this.presenter.configuration = {
            variables:[
                { name:'gap1', value:'Text1.1' },
                { name:'gap2', value:'Text1.2' },
                { name:'gap3', value:'Text1.3' }
            ],
            separators : {
                decimalSeparator: undefined,
                isDecimalSeparatorSet: false,
                thousandSeparator: undefined,
                isThousandSeparatorSet: false
            }
        };

        sinon.stub(this.presenter, 'getEmptyGaps');
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: [] });
    },

    tearDown: function () {
        this.presenter.getModule.restore();
        this.presenter.getEmptyGaps.restore();
    },

    'test none expression evaluates to true': function () {
        this.presenter.configuration.expressions = [ "1 + 3 == 5", "gap1 + 2 == 4", "0 > gap1 + gap2" ];

        assertEquals(0, this.presenter.getScore());
        assertEquals(3, this.presenter.getErrorCount());
    },

    'test single expression evaluates to true': function () {
        this.presenter.configuration.expressions = [ "1 + 3 == 5", "gap1 + 2 == 3", "0 > gap1 + gap2" ];

        assertEquals(0, this.presenter.getScore());
        assertEquals(3, this.presenter.getErrorCount());
    },

    'test multiple expressions evaluates to true': function () {
        this.presenter.configuration.expressions = [ "1 + 3 == 5", "gap1 + 2 == 3", "5 > gap1 + gap2" ];

        assertEquals(0, this.presenter.getScore());
        assertEquals(3, this.presenter.getErrorCount());
    },

    'test all expressions evaluates to true': function () {
        this.presenter.configuration.expressions = [ "1 + 3 == 4", "gap1 + 2 == 3", "5 > gap1 + gap2" ];

        assertEquals(3, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test not all gaps are filled': function () {
        this.presenter.getEmptyGaps.returns({ isValid: true, gaps: ["gap2"] });

        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    }
});
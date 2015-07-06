TestCase("[Basic Math Gaps] Score Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'gapsDefinition' : '[1] + [2] = 3',
            'isEquation' : true,
            'gapsValues' : ['1', '2'],
            'leftValue' : '3.00',
            'rightValue' : '3.00',
            'isActivity' : true,
            'isDisabled' : false,
            'hasBeenStarted' : true,
            isDraggable: false
        };

        this.stubs = {
            getValues: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getValues'),
            getMaxScore: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getMaxScore'),
            areAllGapsEmpty: sinon.stub(this.presenter.GapsContainerObject.prototype, 'areAllGapsEmpty'),
            getStringReconvertedUserExpression: sinon.stub(this.presenter, 'getStringReconvertedUserExpression')
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">+</span>' +
                    '<input value="2" />' +
                    '<span class="element">=</span>' +
                    '<span class="element">3</span>' +
                '</div>' +
            '</div>');

    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.getValues.restore();
        this.presenter.GapsContainerObject.prototype.getMaxScore.restore();
        this.presenter.GapsContainerObject.prototype.areAllGapsEmpty.restore();
        this.presenter.getStringReconvertedUserExpression.restore();
    },

    'test getScore for equation and valid user input' : function() {
        this.stubs.getValues.returns(["1", "2"]);
        this.stubs.getStringReconvertedUserExpression.returns("1+2=3");

        var score = this.presenter.getScore();

        assertEquals(1, score);
    },

    'test getScore for equation and invalid user input' : function() {
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="1" />' +
                '<span class="element">+</span>' +
                '<input value="3" />' +
                '<span class="element">=</span>' +
                '<span class="element">3</span>' +
                '</div>' +
                '</div>');

        this.stubs.getValues.returns(["1", "3"]);
        this.stubs.getStringReconvertedUserExpression.returns("1+3=3");

        var score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test getScore for NOT equation and valid user input' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">></span>' +
                    '<input value="2" />' +
                '</div>' +
            '</div>');

        this.stubs.getValues.returns(["1", "2"]);
        this.stubs.getStringReconvertedUserExpression.returns("1+2");

        var score = this.presenter.getScore();

        assertEquals(2, score);
    },

    'test getScore for NOT equation and invalid user input' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">></span>' +
                    '<input value="1" />' +
                '</div>' +
            '</div>');

        this.stubs.getValues.returns(["1", "1"]);
    this.stubs.getStringReconvertedUserExpression.returns("1+1");

        var score = this.presenter.getScore();

        assertEquals(1, score);
    },

    'test getMaxScore when isEquation' : function() {
        var maxScore = this.presenter.getMaxScore();

        assertEquals(1, maxScore);
    },


    'test getMaxScore when NOT isEquation' : function() {
        this.presenter.configuration.isEquation = false;
        this.stubs.getMaxScore.returns(2);

        var maxScore = this.presenter.getMaxScore();

        assertEquals(2, maxScore);
    },

    'test getMaxScore will return 0 when addon is NOT activity' : function() {
        this.presenter.configuration.isNotActivity = true;


        var maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test an empty gap does NOT count to score and errors, but it returns max score' : function() {
        this.presenter.configuration.gapsValues = ['1', '2'];
        this.presenter.configuration.isEquation = false;
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="" />' +
                '<span class="element">></span>' +
                '<input value="" />' +
                '</div>' +
            '</div>');

        this.stubs.areAllGapsEmpty.returns(true);
        this.stubs.getMaxScore.returns(2);

        var score = this.presenter.getScore(),
            errors = this.presenter.getErrorCount(),
            maxScore = this.presenter.getMaxScore();

        assertEquals(0, score);
        assertEquals(0, errors);
        assertEquals(2, maxScore);
    }
});
TestCase("View Logic Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'isVisible' : true,
            'isDisabled' : false,
            'isActivity' : true,
            'gapsValues' : ['1', '2'],
            'leftValue' : 3,
            'rightValue' : 3
        };
    },

    'test setShowErrorsMode will disable an ability to fill inputs' : function() {
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

        this.presenter.setShowErrorsMode();

        $.each(this.presenter.$view.find('input'), function() {
            assertEquals('disabled', $(this).attr('disabled'));
        });

    },

    'test when addon is NOT equation and user filled NOT all gaps, the rest of them are NOT set as correct or wrong' : function() {
        this.presenter.configuration.isEquation = false;
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">+</span>' +
                    '<input value="" />' +
                    '<span class="element">=</span>' +
                    '<span class="element">3</span>' +
                '</div>' +
            '</div>');

        this.presenter.setShowErrorsMode();

        var inputs = this.presenter.$view.find('input');

        assertTrue($(inputs[0]).hasClass('correct'));

        assertFalse($(inputs[1]).hasClass('correct'));
    },

    'test when addon is equation, the whole addon gets a correct/wrong class' : function() {
        this.presenter.configuration.isEquation = true;
        this.presenter.$view = $(
            '<div>' +
                '<div class="basic-math-gaps-wrapper">' +
                    '<div class="basic-math-gaps-container">' +
                        '<input value="1" />' +
                        '<span class="element">+</span>' +
                        '<input value="2" />' +
                        '<span class="element">=</span>' +
                        '<span class="element">3</span>' +
                    '</div>' +
                '</div>' +
            '</div>');

        this.presenter.setShowErrorsMode();

        assertTrue( this.presenter.$view.find('.basic-math-gaps-container').hasClass('correct') )
    }
});
TestCase("[TrueFalse] Printable HTML", {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();

        this.model = {
            'isNotActivity': "",
            'Multi': "False",
            'Questions': [{
                'Question': "True is on the left",
                'Answer': "1"
            }],
            'Choices': [
                { 'Choice': "True" },
                { 'Choice': "False" }
                ],
            'Is Tabindex Enabled': "False"
        };

        this.spies = {
            upgradeModel : sinon.spy(this.presenter, 'upgradeModel')
        }
    },

    tearDown: function () {
        this.presenter.upgradeModel.restore();
    },

    'test get printable True & False addon model': function () {
        $('<div class="text-identification-container"> </div>');
        var expectedHTML = $('<div class="printable_addon_TrueFalse">' +
            '<table>' +
                '<tbody>' +
                    '<tr>' +
                        '<td></td>' +
                        '<td>True</td>' +
                        '<td>False</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>True is on the left</td>' +
                        '<td class="checkbox-container checkbox-1-1">' +
                            '<div class="placeholder"></div>' +
                            '<input type="checkbox" checked="checked">' +
                            ' <span></span>' +
                        '</td>' +
                        '<td class="checkbox-container checkbox-1-2">' +
                            '<div class="placeholder"></div>' +
                            '<input type="checkbox">' +
                            ' <span></span>' +
                        '</td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
            '</div>');

        var result = this.presenter.getPrintableHTML(this.model, true);

        assertEquals(result, expectedHTML[0].outerHTML.toString());
    },

    'test should update model': function () {
        this.presenter.getPrintableHTML(this.model, true);

        assertTrue(this.spies.upgradeModel.calledOnce);
    },

    'test get evaluation for single choice options': function () {
        this.presenter.printableState = {'selectedElements': [true, false]};

        var result = this.presenter.getPrintableHTML(this.model, true);
        var hasCorrectAnswer = result.includes('correctAnswerMark');
        var hasIncorrectAnswer = result.includes('incorrectAnswerMark');

        assertTrue(hasCorrectAnswer);
        assertFalse(hasIncorrectAnswer);
    },

    'test get evaluation for multiple choice options': function () {
        this.presenter.printableState = {'selectedElements': [true, true]};
        this.model['Multi'] = 'True';

        var result = this.presenter.getPrintableHTML(this.model, true);
        var hasCorrectAnswer = result.includes('correctAnswerMark');
        var hasIncorrectAnswer = result.includes('incorrectAnswerMark');

        assertTrue(hasIncorrectAnswer);
        assertTrue(hasCorrectAnswer);
    }
});
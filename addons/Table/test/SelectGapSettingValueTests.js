function addOptionsToSelect(select, options) {
    options.forEach(
        function (option) {
            var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            select.appendChild(optionElement);
        }
    );
}

TestCase("[Table] Select gap show answers tests", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'id',
            gapWidth: { isSet: false },
            isActivity: true
        };
        this.presenter.eventBus = sinon.spy();

        this.presenter.textParser = {
            escapeXMLEntities: sinon.stub()
        };

        this.gapID = 'gapID';

        this.selectElement = document.createElement('select');
        this.selectElement.id = this.gapID;
    },

    tearDown: function () {
        this.selectElement.remove();
    },

    'test given options in correct answer when show answer called then escapes xml entities from answer': function () {
        var options = [ '---', 'value' ];
        addOptionsToSelect(this.selectElement, options);
        var correctAnswer = options[1];
        this.presenter.textParser.escapeXMLEntities.returns(correctAnswer);

        var gap = new this.presenter.SelectGap(this.gapID, correctAnswer, 1);
        gap.showAnswers();

        assertEquals(correctAnswer, this.selectElement.selectedOptions[0].text);
        assertTrue(this.presenter.textParser.escapeXMLEntities.called)
    }


});
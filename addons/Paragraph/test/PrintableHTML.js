TestCase("[Paragraph] get printable HTML", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.presenter.configuration = {
            isValid: true
        };

        this.model = {
            'Bottom': '',
            'Custom CSS': '',
            'Is Visible': 'True',
            'ID': 'Paragraph1',
            'Show Answers': '',
            'printable': "Don't randomize"
        };

        this.spies = {
            upgradeModel : sinon.spy(this.presenter, 'upgradeModel'),
            validateModel : sinon.spy(this.presenter, 'validateModel'),
        };
    },

    'test display model answer after getPrintableHTML call when users answer is empty': function () {
        this.model['Show Answers'] = 'This is a testing answer for Paragraph addon.';
        var result = this.presenter.getPrintableHTML(this.model, true);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'This is a testing answer for Paragraph addon.');
    },

    'test given show answers on false when getPrintableHTML was called should return empty paragraph': function () {
        this.model['Show Answers'] = 'This is a testing answer for Paragraph addon.';
        var result = this.presenter.getPrintableHTML(this.model, false);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, '');
    },

    'test update and validate model in printable method on printing HTML': function () {
        this.presenter['printableState'] = {'tinymceState' : 'This is an example users answer.'}
        this.presenter.getPrintableHTML(this.model, true);

        assertTrue(this.spies.upgradeModel.called);
        assertTrue(this.spies.validateModel.called);
    }
});
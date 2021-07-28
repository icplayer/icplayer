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
            getModelAnswer : sinon.spy(this.presenter, 'getModelAnswer'),
            getUsersAnswer : sinon.spy(this.presenter, 'getUsersAnswer')
        };
    },

    'test display model answer': function () {
        this.model['Show Answers'] = 'This is a testing answer for Paragraph addon.';
        var result = this.presenter.getPrintableHTML(this.model, true);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'This is a testing answer for Paragraph addon.');
        assertTrue(this.spies.getUsersAnswer.called);
    },

    'test display user answer': function () {
        this.presenter['printableState'] = {'usersAnswer' : 'This is an example users answer.'}
        this.model['Show Answers'] = 'This is a testing answer for Paragraph addon.';
        var result = this.presenter.getPrintableHTML(this.model, true);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'This is an example users answer.');
        assertTrue(this.spies.getUsersAnswer.called);
    },

    'test update and validate model in printable method': function () {
        this.presenter.getPrintableHTML(this.model, true);

        assertTrue(this.spies.upgradeModel.called);
        assertTrue(this.spies.validateModel.called);
    }
});
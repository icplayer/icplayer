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

    'test given EMPTY_PRINTABLE_STATE when getPrintableHTML then result is empty': function () {
        this.model['Show Answers'] = 'Model answer for paragraph.';
        const showAnswers = false;
        this.presenter['printableState'] = undefined;

        var result = this.presenter.getPrintableHTML(this.model, showAnswers);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, '');
    },

    'test given USER_ANSWER_STATE when getPrintableHTML then result is equal to user answer': function () {
        this.model['Show Answers'] = 'Model answer for paragraph.';
        const showAnswers = false;
        this.presenter['printableState'] = 'This is an example users answer.';

        var result = this.presenter.getPrintableHTML(this.model, showAnswers);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'This is an example users answer.');
    },

    'test given SHOW_ANSWER_STATE when getPrintableHTML then result is equal to model answer': function () {
        this.model['Show Answers'] = 'Model answer for paragraph.';
        const showAnswers = true;
        this.presenter['printableState'] = undefined;

        var result = this.presenter.getPrintableHTML(this.model, showAnswers);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'Model answer for paragraph.');
    },

    'test given CHECK_ANSWER_STATE when getPrintableHTML then result is equal to user answer': function () {
        //in paragraph there is no automatic check, so CHECK_ANSWERS STATE (setState + showAnswers=true)
        //is just simply user answer
        this.model['Show Answers'] = 'Model answer for paragraph.';
        const showAnswers = true;
        this.presenter['printableState'] = 'This is an example users answer.';

        var result = this.presenter.getPrintableHTML(this.model, showAnswers);
        result = result.replace(/<(.*?)>/g, '');

        assertEquals(result, 'This is an example users answer.');
    },

    'test update and validate model in printable method on printing HTML': function () {
        this.presenter['printableState'] = {'tinymceState' : 'This is an example users answer.'}
        this.presenter.getPrintableHTML(this.model, true);

        assertTrue(this.spies.upgradeModel.called);
        assertTrue(this.spies.validateModel.called);
    }
});
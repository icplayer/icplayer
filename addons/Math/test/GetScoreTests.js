TestCase("[Math] Get state tests", {
    setUp: function () {
        this.presenter = AddonMath_create();

        this.presenter.toggleAnswers = sinon.spy();

        this.presenter.configuration = {
            expressions: {},
            answers: [{name: "g1", value: "cat1", users: ""}],
            variables: [{name: "g1", value: "Text1.1"}]
        };
    },

    'test given show answers active when getScore called then show answers should be switched off and on': function () {
        this.presenter.isShowAnswers = true;

        this.presenter.getScore();

        sinon.assert.calledTwice(this.presenter.toggleAnswers);
    },
});

TestCase("[TextColoring] AllOk Event", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();
        this.presenter.configuration = {
            countErrors: true
        };

        this.stubs = {
            getMaxScoreStub: sinon.stub(this.presenter, 'getMaxScore'),
            getScoreStub: sinon.stub(this.presenter, 'getScore'),
            getErrorCountStub: sinon.stub(this.presenter, 'getErrorCount')
        };

        this.$element = $('<div></div>');
    },

    'test given countErrors==true, Score==maxScore and errors==0, when calling isAllOk, then return true': function () {
        this.stubs.getMaxScoreStub.returns(3);
        this.stubs.getScoreStub.returns(3);
        this.stubs.getErrorCountStub.returns(0);

        var result = this.presenter.isAllOK();

        assertTrue(result);
    },

    'test given countErrors==true, Score==maxScore and errors!=0, when calling isAllOk, then return false': function () {
        this.stubs.getMaxScoreStub.returns(3);
        this.stubs.getScoreStub.returns(3);
        this.stubs.getErrorCountStub.returns(1);

        var result = this.presenter.isAllOK();

        assertFalse(result);
    },

    'test given countErrors==true, Score!=maxScore and errors!=0, when calling isAllOk, then return false': function () {
        this.stubs.getMaxScoreStub.returns(3);
        this.stubs.getScoreStub.returns(2);
        this.stubs.getErrorCountStub.returns(1);

        var result = this.presenter.isAllOK();

        assertFalse(result);
    },

    'test given countErrors==true, Score!=maxScore and errors==0, when calling isAllOk, then return false': function () {
        this.stubs.getMaxScoreStub.returns(3);
        this.stubs.getScoreStub.returns(2);
        this.stubs.getErrorCountStub.returns(0);

        var result = this.presenter.isAllOK();

        assertFalse(result);
    }
});
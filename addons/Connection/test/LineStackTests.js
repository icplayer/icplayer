function getLineStub (isDisabled) {
    var isDisabledStub = sinon.stub();

    isDisabledStub.returns(isDisabled);

    return {
        isDisabled: isDisabledStub
    }
}

TestCase("[Connection] Line Stack", {
    setUp: function () {
        this.presenter = AddonConnection_create();
        this.lineStack = this.presenter.lineStack;
    },

    'test given some elements in line stack when getDisabledCount is called then will return count of disabled lines': function () {
        this.lineStack.stack = [getLineStub(false), getLineStub(true), getLineStub(false)];

        var disabledCount = this.lineStack.getDisabledCount();

        assertEquals(1, disabledCount);
    }
});
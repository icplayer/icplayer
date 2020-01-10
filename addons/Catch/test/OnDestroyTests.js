function createSpyObject() {
    return {
        stop: sinon.spy(),
        remove: sinon.spy()
    };
}

TestCase("[Catch] On destroy tests", {
    setUp: function () {
        this.presenter = AddonCatch_create();

        this.spyObjects = [
            createSpyObject(),
            createSpyObject(),
            createSpyObject()
        ];

        this.catchObjects = this.spyObjects.map(function (spy) {
            return {
                obj: spy
            }
        });
    },

    'test given some catch object when clearing objects then calls stop and remove methods on all objects' : function () {
        this.presenter.clearCatchObjects(this.catchObjects);

        this.spyObjects.forEach(function(spy) {
            sinon.assert.calledOnce(spy.stop);
            sinon.assert.calledOnce(spy.remove);
        });
    },

    'test given presenter object when calling onDestroy then calls clearCatchObjects method' : function () {
        var spy = sinon.stub(this.presenter, "clearCatchObjects");

        this.presenter.onDestroy();

        sinon.assert.calledOnce(spy);

        spy.restore();
    }


});

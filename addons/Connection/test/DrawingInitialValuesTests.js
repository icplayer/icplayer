function getModelColumnData(id) {
    return {
        id: id
    }
}

function getInitialValue(from, to) {
    return {
        from: from,
        to: to
    }
}

function getElement (id) {
    return {
        id: id,
        element: {
            get: sinon.stub()
        }
    };
}

TestCase("[Connection] Drawing initial values", {
    setUp: function () {
        this.presenter = AddonConnection_create();
        this.presenter.elements = [
            getElement("a"),
            getElement("b"),
            getElement("c"),
            getElement("1"),
            getElement("2"),
            getElement("3")

        ];
        this.presenter.showErrorMessage = sinon.spy();

        this.presenter.model = {
            'Left column': [
                getModelColumnData("a"),
                getModelColumnData("b"),
                getModelColumnData("c")
            ],
            'Right column': [
                getModelColumnData("1"),
                getModelColumnData("2"),
                getModelColumnData("3")
            ]
        }
    },

    'test given initial values when drawInitialValues is called then will disable sendEvents and will enable it': function () {
        var wasEnabled = false;
        this.presenter.lineStack.setSendEvents = sinon.spy();
        this.presenter.initialValues = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.drawInitialValue = function () {
            // Check if for each drawInitialValue call setSendEvents was only once called
            if (this.presenter.lineStack.setSendEvents.callCount !== 1) {
                wasEnabled = false;
            }
        }.bind(this);

        this.presenter.redraw = function () {};

        this.presenter.drawInitialValues();

        assertFalse(wasEnabled);
        assertEquals(2, this.presenter.lineStack.setSendEvents.callCount);
        assertFalse(this.presenter.lineStack.setSendEvents.getCall(0).args[0]);
        assertTrue(this.presenter.lineStack.setSendEvents.getCall(1).args[0]);
    },

    'test given initial values when drawInitialValues is called then will call drawInitialValue for each value': function () {
        this.presenter.initialValues = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.drawInitialValue = sinon.stub();

        this.presenter.drawInitialValue.onCall(0).returns(true);
        this.presenter.drawInitialValue.onCall(1).returns(false);
        this.presenter.drawInitialValue.onCall(2).returns(false);

        this.presenter.redraw = function () {};

        this.presenter.drawInitialValues();

        assertEquals(this.presenter.initialValues.length, this.presenter.drawInitialValue.callCount);
        for (var i = 0; i < this.presenter.initialValues.length; i++) {
            assertEquals(this.presenter.initialValues[i], this.presenter.drawInitialValue.getCall(i).args[0])
        }
    },

    'test given initial values with one of them is correct when drawInitialValues is called then will call redraw': function () {
        this.presenter.drawInitialValue = sinon.stub();
        this.presenter.drawInitialValue.onCall(0).returns(true);
        this.presenter.drawInitialValue.onCall(1).returns(false);
        this.presenter.drawInitialValue.onCall(2).returns(false);
        this.presenter.initialValues = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.redraw = sinon.spy();

        this.presenter.drawInitialValues();

        assertTrue(this.presenter.redraw.calledOnce);
    },

    'test given inital values without correct value when drawInitialValues is called then redraw wont be called': function () {
        this.presenter.drawInitialValue = sinon.stub();
        this.presenter.drawInitialValue.onCall(0).returns(false);
        this.presenter.drawInitialValue.onCall(1).returns(false);
        this.presenter.drawInitialValue.onCall(2).returns(false);
        this.presenter.initialValues = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.redraw = sinon.spy();

        this.presenter.drawInitialValues();

        assertFalse(this.presenter.redraw.called);
    },

    'test given correct initial value when drawInitialValue is called then will push new line and will return true': function () {
        this.presenter.lineStack.setSendEvents(false);
        var initialValue = getInitialValue("a", "1");

        var output = this.presenter.drawInitialValue(initialValue);

        assertTrue(output);
        assertFalse(this.presenter.showErrorMessage.called);
        assertEquals(1, this.presenter.lineStack.length());
        assertEquals(this.presenter.elements[0].element, this.presenter.lineStack.get(0).from);
        assertEquals(this.presenter.elements[3].element, this.presenter.lineStack.get(0).to);
    },

    'test given empty initial value entry when drawInitialValue is called then will return false and doesn\'t put new linee': function () {
        this.presenter.lineStack.setSendEvents(false);
        var initialValue = getInitialValue("", "");

        var output = this.presenter.drawInitialValue(initialValue);

        assertFalse(output);
        assertEquals(0, this.presenter.lineStack.length());
        assertFalse(this.presenter.showErrorMessage.called);

    },

    'test given "from" value with not existing value when drawInitialValue is called then will return false, set error message to view and doesn\'t put new line': function () {
        this.presenter.lineStack.setSendEvents(false);

        var initialValue = getInitialValue("abc", "1");

        this.callAndExpectError(initialValue, "One or two not exists");
    },

    'test given "to" value with not existing value when drawInitialValue is called then will return false, set error message to view and doesn\'t put new line': function () {
        this.presenter.lineStack.setSendEvents(false);

        var initialValue = getInitialValue("a", "123");

        this.callAndExpectError(initialValue, "One or two not exists");
    },

    'test given "from" and "to" from left col when drawInitialValue is called then will return false, set error message and doesn\'t put new line': function () {
        this.presenter.lineStack.setSendEvents(false);

        var initialValue = getInitialValue("a", "b");

        this.callAndExpectError(initialValue, "Are from the same column");
    },

    'test given "from" and "to" from right col when drawInitialValue is called then will return false, set error message and doesn\'t put new line': function () {
        this.presenter.lineStack.setSendEvents(false);

        var initialValue = getInitialValue("1", "2");

        this.callAndExpectError(initialValue, "Are from the same column");
    },

    callAndExpectError: function (initialValue, errorMessage) {
        var output = this.presenter.drawInitialValue(initialValue);
        assertFalse(output);
        assertTrue(this.presenter.showErrorMessage.calledOnce);
        assertEquals(errorMessage, this.presenter.showErrorMessage.getCall(0).args[0]);
        assertEquals(0, this.presenter.lineStack.length());
    }
});
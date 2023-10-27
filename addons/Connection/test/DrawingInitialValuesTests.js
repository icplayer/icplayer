TestCase("[Connection] Drawing initial values", {
    setUp: function () {
        this.presenter = AddonConnection_create();
        this.presenter.elements = [
            this.getElement("a"),
            this.getElement("b"),
            this.getElement("c"),
            this.getElement("1"),
            this.getElement("2"),
            this.getElement("3")
        ];

        this.presenter.model = {
            'Left column': [
                this.getModelColumnData("a"),
                this.getModelColumnData("b"),
                this.getModelColumnData("c")
            ],
            'Right column': [
                this.getModelColumnData("1"),
                this.getModelColumnData("2"),
                this.getModelColumnData("3")
            ]
        };

        this.presenter.configuration = {};
    },

    'test given initial values when drawInitialValues is called then will disable sendEvents and will enable it': function () {
        var wasEnabled = false;
        this.presenter.lineStack.setSendEvents = sinon.spy();
        this.presenter.configuration.initialConnections = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.drawInitialValue = function () {
            // Check if for each drawInitialValue call setSendEvents was only once called
            if (this.presenter.lineStack.setSendEvents.callCount !== 1) {
                wasEnabled = true;
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
        this.presenter.configuration.initialConnections = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.drawInitialValue = sinon.stub();

        this.presenter.drawInitialValue.onCall(0).returns(true);
        this.presenter.drawInitialValue.onCall(1).returns(false);
        this.presenter.drawInitialValue.onCall(2).returns(false);

        this.presenter.redraw = function () {};

        this.presenter.drawInitialValues();

        assertEquals(this.presenter.configuration.initialConnections.length, this.presenter.drawInitialValue.callCount);
        for (var i = 0; i < this.presenter.configuration.initialConnections.length; i++) {
            assertEquals(this.presenter.configuration.initialConnections[i], this.presenter.drawInitialValue.getCall(i).args[0])
        }
    },

    'test given initial values with one of them is correct when drawInitialValues is called then will call redraw': function () {
        this.presenter.drawInitialValue = sinon.stub();
        this.presenter.drawInitialValue.onCall(0).returns(true);
        this.presenter.drawInitialValue.onCall(1).returns(false);
        this.presenter.drawInitialValue.onCall(2).returns(false);
        this.presenter.configuration.initialConnections = [sinon.stub(), sinon.stub(), sinon.stub()];
        this.presenter.redraw = sinon.spy();

        this.presenter.drawInitialValues();

        assertTrue(this.presenter.redraw.calledOnce);
    },

    'test given correct initial value when drawInitialValue is called then will push new line and will return true': function () {
        this.presenter.lineStack.setSendEvents(false);
        var initialValue = this.getInitialValue("a", "1");

        this.presenter.drawInitialValue(initialValue);

        assertEquals(1, this.presenter.lineStack.length());
        assertEquals(this.presenter.elements[0].element, this.presenter.lineStack.get(0).from);
        assertEquals(this.presenter.elements[3].element, this.presenter.lineStack.get(0).to);
    },

    'test given empty initial value entry when drawInitialValue is called then will return false and doesn\'t put new linee': function () {
        this.presenter.lineStack.setSendEvents(false);
        var initialValue = this.getInitialValue("", "");

        this.presenter.drawInitialValue(initialValue);

        assertEquals(0, this.presenter.lineStack.length());
    },

    getModelColumnData: function(id) {
        return {
            id: id
        };
    },

    getInitialValue: function (from, to) {
        return {
            from: from,
            to: to
        };
    },

    getElement: function (id) {
        return {
            id: id,
            element: {
                get: sinon.stub()
            }
        };
    }
});
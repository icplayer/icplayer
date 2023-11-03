TestCase("[Connection] Validate Initial Values", {
    setUp: function () {
        this.presenter = AddonConnection_create();

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
            ],
        };
    },

    'test given list of values to validate when validateInitialConnections is called then will call validation for each value': function () {
        this.presenter.validateInitialConnection = sinon.stub();
        this.presenter.validateInitialConnection.returns({isValid: true});
        var initialConnections = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        this.presenter.validateInitialConnections(initialConnections);

        assertEquals(initialConnections.length, this.presenter.validateInitialConnection.callCount);
        initialConnections.forEach(function (element, index) {
            assertEquals(element, this.presenter.validateInitialConnection.getCall(index).args[0]);
        }, this);
    },

    'test given list of values with one error when validateInitialConnections is called then will return dict with error message and isValid set to false': function () {
        this.presenter.validateInitialConnection = sinon.stub();
        this.presenter.validateInitialConnection.onCall(0).returns({isValid: true});
        this.presenter.validateInitialConnection.onCall(1).returns({isValid: true});
        this.presenter.validateInitialConnection.onCall(2).returns({
            isValid: false,
            errorCode: this.presenter.ERROR_MESSAGES["Are from the same column"]
        });
        this.presenter.validateInitialConnection.onCall(3).returns({isValid: true});
        var initialConnections = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        var result = this.presenter.validateInitialConnections(initialConnections);

        assertFalse(result.isValid);
        assertEquals(3, this.presenter.validateInitialConnection.callCount);
        assertEquals(this.presenter.ERROR_MESSAGES["Are from the same column"], result.errorCode);
    },

    'test given list of correct values when validateInitialConnections is called then will return dict with isValid set to true': function () {
        this.presenter.validateInitialConnection = sinon.stub();
        this.presenter.validateInitialConnection.returns({isValid: true});
        var initialConnections = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        assertTrue(this.presenter.validateInitialConnections(initialConnections).isValid);
    },

    'test given empty initial value when validateInitialConnection is called then will return dict with given value and isValid set to true': function () {
        var initialValue = this.getInitialValue("", "");

        var result = this.presenter.validateInitialConnection(initialValue);

        assertTrue(result.isValid);
        assertEquals(initialValue, result.value);
    },

    'test given two values from different cols when validateInitialConnection is called then will return dict with given value and isValid set to true': function () {
        var initialValue = this.getInitialValue("1", "a");

        var result = this.presenter.validateInitialConnection(initialValue);

        assertTrue(result.isValid);
        assertEquals(initialValue, result.value);
    },

    'test given "from" value with not existing value when validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.callAndExpectError(this.getInitialValue("e", "1"), 'One or two not exist');
    },

    'test given "to" value with not existing value when validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.callAndExpectError(this.getInitialValue("a", "8"), 'One or two not exist');
    },

    'test given initial values from left column when validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.callAndExpectError(this.getInitialValue("a", "b"), 'Are from the same column');
    },

    'test given initial values from right column when validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.callAndExpectError(this.getInitialValue("1", "2"), 'Are from the same column');
    },

    'test given initial values from left column when horizontal orientation and validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.presenter.chooseOrientation = sinon.stub();
        this.presenter.isHorizontal = true;

        this.callAndExpectError(this.getInitialValue("a", "b"), 'Are from the same row');
    },

    'test given initial values from right column when horizontal orientation and validateInitialConnection is called then will return dict with error message and isValid set to false': function () {
        this.presenter.chooseOrientation = sinon.stub();
        this.presenter.isHorizontal = true;

        this.callAndExpectError(this.getInitialValue("1", "2"), 'Are from the same row');
    },

    callAndExpectError: function (initialValue, errorMessage) {
        var result = this.presenter.validateInitialConnection(initialValue);
        assertFalse(result.isValid);
        assertEquals(errorMessage, result.errorCode);
    },

    getInitialValue: function(from, to) {
        return {
            from: from,
            to: to
        };
    },

    getModelColumnData: function(id) {
        return {
            id: id
        };
    }
});
TestCase("[Connection] Validate Initial Values", {
    setUp: function () {
        this.presenter = AddonConnection_create();
        this.presenter.showErrorMessage = sinon.spy();

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
    },

    'test given list of values to validate when validateInitialValues is called then will call validation for each value': function () {
        this.presenter.validateInitialValue = sinon.stub();
        this.presenter.validateInitialValue.returns(true);
        this.presenter.initialValues = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        this.presenter.validateInitialValues();

        assertEquals(this.presenter.initialValues.length, this.presenter.validateInitialValue.callCount);
        this.presenter.initialValues.forEach(function (element, index) {
            assertEquals(element, this.presenter.validateInitialValue.getCall(index).args[0]);
        }, this);
    },

    'test given list of values with one error when validateInitialValues is called then will return false': function () {
        this.presenter.validateInitialValue = sinon.stub();
        this.presenter.validateInitialValue.onCall(0).returns(true);
        this.presenter.validateInitialValue.onCall(1).returns(true);
        this.presenter.validateInitialValue.onCall(2).returns(false);
        this.presenter.validateInitialValue.onCall(3).returns(true);

        this.presenter.initialValues = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        assertFalse(this.presenter.validateInitialValues());
        assertEquals(3, this.presenter.validateInitialValue.callCount);
    },

    'test given list of correct values when validateInitialValues is called then will return true': function () {
        this.presenter.validateInitialValue = sinon.stub();
        this.presenter.validateInitialValue.returns(true);
        this.presenter.initialValues = [
            this.getInitialValue("", ""),
            this.getInitialValue("a", "b"),
            this.getInitialValue("1", "a"),
            this.getInitialValue("c", "a")
        ];

        assertTrue(this.presenter.validateInitialValues());
    },

    'test given empty initial value when validateInitialValue is called then will return valid': function () {
        assertTrue(this.presenter.validateInitialValue(this.getInitialValue("", "")));
    },

    'test given two values from different cols when validateInitialValue is called then will return valid': function () {
        assertTrue(this.presenter.validateInitialValue(this.getInitialValue("1", "a")));
    },

    'test given "from" value with not existing value when validateInitialValue is called then will return false and will show error': function () {
        this.callAndExpectError(this.getInitialValue("e", "1"), 'One or two not exist');
    },

    'test given "to" value with not existing value when validateInitialValue is called then will return false and will show error': function () {
        this.callAndExpectError(this.getInitialValue("a", "8"), 'One or two not exist');
    },

    'test given initial values from left column when validateInitialValue is called then will return false and will show error': function () {
        this.callAndExpectError(this.getInitialValue("a", "b"), 'Are from the same column');
    },

    'test given initial values from right column when validateInitialValue is called then will return false and will show error': function () {
        this.callAndExpectError(this.getInitialValue("1", "2"), 'Are from the same column');
    },

    callAndExpectError: function (initialValue, errorMessage) {
        assertFalse(this.presenter.validateInitialValue(initialValue));
        assertTrue(this.presenter.showErrorMessage.calledOnce);
        assertEquals(errorMessage, this.presenter.showErrorMessage.getCall(0).args[0]);
    },

    getInitialValue: function(from, to) {
        return {
            from: from,
            to: to
        }
    },

    getModelColumnData: function(id) {
        return {
            id: id
        };
    }
});
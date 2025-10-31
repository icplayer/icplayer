TestCase("[Math] On Before Printable tests", {
    setUp: function () {
        this.presenter = AddonMath_create();

        this.presenter.configuration = {
            expressions: {},
            answers: [{name: "g1", value: "cat1", users: ""}],
            variables: [{name: "g1", value: "Text1.1"}]
        };

        this.presenter.printableController = {
            getModuleState: function (addonId) {
                switch (addonId) {
                    case "Table1":
                        return '{"gaps":[{"isAttempted":true,"isEnabled":true,"value":"1"},{"isAttempted":false,"isEnabled":true,"value":""}],"isVisible":true,"spans":null}';
                    case "Text1":
                        return '{"gapUniqueId":"76CtU7", "values":"{\\"76CtU7-1\\":\\"1\\", \\"76CtU7-2\\":\\"2\\"}", "consumed":"{}", "disabled":"[false,false,false]", "isVisible":"true", "droppedElements":"{}", "hasBeenAccessed":"{}", "timerBase":"107649"}';
                    default:
                        return null;
                }
            }
        }
    },

    'test given Table state when isTableState is called then return true': function () {
        let state = {"gaps":[{"isAttempted":false,"isEnabled":true,"value":""},{"isAttempted":false,"isEnabled":true,"value":""}],"isVisible":true,"spans":null};

        let result = this.presenter.isTableState(state);

        assertTrue(result);
    },

    'test given Text state when isTableState is called then return false': function () {
        let state = {"gapUniqueId":"4x6v8F", "values":"{}", "consumed":"{}", "disabled":"[false,false,false,false]", "isVisible":"true", "droppedElements":"{}", "hasBeenAccessed":"{}", "timerBase":"154650"};

        let result = this.presenter.isTableState(state);

        assertFalse(result);
    },

    'test given Table state when isTextState is called then return false': function () {
        let state = {"gaps":[{"isAttempted":false,"isEnabled":true,"value":""},{"isAttempted":false,"isEnabled":true,"value":""}],"isVisible":true,"spans":null};

        let result = this.presenter.isTextState(state);

        assertFalse(result);
    },

    'test given Text state when isTextState is called then return true': function () {
        let state = {"gapUniqueId":"4x6v8F", "values":"{}", "consumed":"{}", "disabled":"[false,false,false,false]", "isVisible":"true", "droppedElements":"{}", "hasBeenAccessed":"{}", "timerBase":"154650"};

        let result = this.presenter.isTextState(state);

        assertTrue(result);
    },

    'test given id of Table gap when getVariableValueFromPrintableState is called then return correct value': function () {
        let result = this.presenter.getVariableValueFromPrintableState("Table1.1");

        assertEquals(1, result);
    },

    'test given id of Text gap when getVariableValueFromPrintableState is called then return correct value': function () {
        let result = this.presenter.getVariableValueFromPrintableState("Text1.2");

        assertEquals(2, result);
    },

    'test given id of a non-existing gap in an existing addon when getVariableValueFromPrintableState is called then return null': function () {
        let result = this.presenter.getVariableValueFromPrintableState("Text1.10");

        assertEquals(null, result);
    },

    'test given id with incorrect syntax when getVariableValueFromPrintableState is called then return null': function () {
        let result = this.presenter.getVariableValueFromPrintableState("Text110");

        assertEquals(null, result);
    },

    'test given id of a gap in a non-existing addon when getVariableValueFromPrintableState is called then return null': function () {
        let result = this.presenter.getVariableValueFromPrintableState("Text111.1");

        assertEquals(null, result);
    },


});

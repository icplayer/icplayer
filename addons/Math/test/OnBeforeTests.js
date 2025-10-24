TestCase("[Math] On Before Printable tests", {
    setUp: function () {
        this.presenter = AddonMath_create();

        this.presenter.configuration = {
            expressions: {},
            answers: [{name: "g1", value: "cat1", users: ""}],
            variables: [{name: "g1", value: "Text1.1"}]
        };
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


});

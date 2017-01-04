TestCase("[Model Error Utils] Utils", {

    'test getErrorObject should return error object with passed error code': function () {
        var errorObject = {
            isValid: false,
            isError: true,
            errorCode: "S01"
        };

        var result = ModelErrorUtils.getErrorObject("S01");

        assertEquals(errorObject, result);
    }
});

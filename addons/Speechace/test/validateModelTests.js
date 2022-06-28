TestCase("[Speechace] Test validateCourseId method", {
    setUp: function () {
        this.presenter = AddonSpeechace_create();
    },

    'test given no property CourseId when validateCourseId then return isValid false and errorCode V_01': function () {
        var courseId = undefined;

        var validatedCourseId = this.presenter.validateCourseId(courseId);

        assertFalse(validatedCourseId.isValid);
        assertEquals(validatedCourseId.errorCode, "V_01");
    },

    'test given only white space property CourseId when validateCourseId then return isValid false and errorCode V_01': function () {
        var courseId = "      ";

        var validatedCourseId = this.presenter.validateCourseId(courseId);

        assertFalse(validatedCourseId.isValid);
        assertEquals(validatedCourseId.errorCode, "V_01");
    },

    'test given correct value with white spaces around when validateCourseId then return isValid true and trimmed value': function () {
        var courseId = "  test_embed    ";

        var validatedCourseId = this.presenter.validateCourseId(courseId);

        assertTrue(validatedCourseId.isValid);
        assertEquals(validatedCourseId.value, "test_embed");
    },

    'test given simply correct value when validateCourseId then return isValid true and unchanged value': function () {
        var courseId = "test_embed";

        var validatedCourseId = this.presenter.validateCourseId(courseId);

        assertTrue(validatedCourseId.isValid);
        assertEquals(validatedCourseId.value, "test_embed");
    }
});

TestCase("[Speechace] Test validateModel method", {
    setUp: function () {
        this.presenter = AddonSpeechace_create();
    },

    'test given invalid courseId when validateModel then returns isValid false': function () {
        var model = {
            Id: "Speechace_1",
            "Is Visible": true,
            courseId: undefined
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isValid);
    },

    'test given valid courseId and other values when validateModel then returns expected results': function () {
        var model = {
            ID: "Speechace_1",
            CourseId: "test_embed",
            "Is Visible": "True"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isValid);
        assertTrue(validatedModel.isVisible);
        assertEquals(model.ID, validatedModel.addonID);
        assertEquals(model.CourseId, validatedModel.courseId);
        assertEquals(validatedModel.maxScore, 100);
    },
});
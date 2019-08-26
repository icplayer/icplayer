TestCase("[Cross Lesson] Model validation", {
    setUp: function () {
        this.presenter = AddonCross_Lesson_create();
    },

    'test given correct model when validating then return correct configuration': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "lesson"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals("Go to lesson", validatedModel.buttonText);
        assertEquals("/file/server/123456", validatedModel.image);
        assertEquals("1234567", validatedModel.courseID);
        assertEquals("testLesson", validatedModel.lessonID);
        assertEquals("xQNFEDISERT", validatedModel.page);
        assertEquals("lesson", validatedModel.type)
    },

    'test given model without lesson ID when validating then return correct error code': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "",
            Page: "xQNFEDISERT",
            Type: "lesson"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_01", validatedModel.errorCode);
    },

    'test given model with invalid course ID when validating then return correct error code': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "woanfeagnel",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "lesson"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_02", validatedModel.errorCode);
    },

    'test given model with invalid resource type when validating then return correct error code': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "hello world"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_03", validatedModel.errorCode);
    },

    'test given model without resource type when validating then set type to lesson': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: ""
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals("lesson", validatedModel.type)
    }
});
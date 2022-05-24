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
            Type: "lesson",
            OpenLessonInCurrentTab: "True",
            langAttribute: "PL-pl",
            CheckForAccess: "True",
            AccessIDs: "1234, 5678"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals("Go to lesson", validatedModel.buttonText);
        assertEquals("/file/server/123456", validatedModel.image);
        assertEquals("1234567", validatedModel.courseID);
        assertEquals("testLesson", validatedModel.lessonID);
        assertEquals("xQNFEDISERT", validatedModel.page);
        assertEquals("lesson", validatedModel.type);
        assertEquals(true, validatedModel.openLessonInCurrentTab);
        assertEquals("PL-pl", validatedModel.langTag);
        assertEquals(true, validatedModel.checkForAccess);
        assertEquals([1234, 5678], validatedModel.accessIds);
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

    'test given model with checkForAccess selected and empty accessIds when validation then return error code V_04': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "lesson",
            OpenLessonInCurrentTab: "True",
            langAttribute: "PL-pl",
            CheckForAccess: "True",
            AccessIDs: ""
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_04", validatedModel.errorCode);
    },

    'test given model with checkForAccess not selected and filled accessIds when validation then return error code V_05': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "lesson",
            OpenLessonInCurrentTab: "True",
            langAttribute: "PL-pl",
            CheckForAccess: "False",
            AccessIDs: "1234"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_05", validatedModel.errorCode);
    },

    'test given model with checkForAccess selected and filled improperly accessIds when validation then return error code V_06': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "lesson",
            OpenLessonInCurrentTab: "True",
            langAttribute: "PL-pl",
            CheckForAccess: "True",
            AccessIDs: "12e34s"
        };

        var validatedModel = this.presenter.validateModel(model);

        assertTrue(validatedModel.isError);
        assertEquals("V_06", validatedModel.errorCode);
    },

    'test given model without resource type when validating then set type to lesson': function () {
        var model = {
            Text: "Go to lesson",
            Image: "/file/server/123456",
            CourseID: "1234567",
            LessonID: "testLesson",
            Page: "xQNFEDISERT",
            Type: "",
            CheckForAccess: "False",
            AccessIDs: "",
        };

        var validatedModel = this.presenter.validateModel(model);

        assertFalse(validatedModel.isError);
        assertEquals("lesson", validatedModel.type)
    }
});

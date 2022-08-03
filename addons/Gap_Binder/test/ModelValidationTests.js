TestCase("[Gap Binder] Model Validation tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();
        this.$testHTML = $('<div>'+
        '<div class="ic_text ice_module" id="Text1" lang="" data-relative-left=":left" data-relative-top=":top" style="width: 425px; height: 175px; position: absolute; left: 25px; top: 175px;">Text Module can be used for gap filling activities<ol><li>An editable or a draggable gap: <input id="editor-DPHQbp-1" type="edit" data-gap="editable" size="8" class="ic_gap" style="width: 80px;">.</li><li>A gap with 2 correct options: <input id="editor-DPHQbp-2" type="edit" data-gap="editable" size="9" class="ic_gap" style="width: 80px;">.</li><li>This is a filled gap: <input data-gap="filled" id="editor-DPHQbp-3" type="edit" size="12" placeholder="initial text" class="ic_filled_gap" style="width: 80px;"></li></ol></div>'+
        '<div class="ic_text ice_module" id="Text2" lang="" data-relative-left=":left" data-relative-top=":top" style="width: 425px; height: 175px; position: absolute; left: 25px; top: 175px;">Text Module can be used for gap filling activities<ol><li>An editable or a draggable gap: <input id="editor-ADPHQbp-1" type="edit" data-gap="editable" size="8" class="ic_gap" style="width: 80px;">.</li><li>A gap with 2 correct options: <input id="editor-ADPHQbp-2" type="edit" data-gap="editable" size="9" class="ic_gap" style="width: 80px;">.</li><li>This is a filled gap: <input data-gap="filled" id="editor-ADPHQbp-3" type="edit" size="12" placeholder="initial text" class="ic_filled_gap" style="width: 80px;"></li></ol></div>'+
        '</div>');

        this.model = {
            Items: [
                {
                    Modules: "Text1",
                    Answers: "ans1\nans2\nans3"
                }
            ]
        };
        this.presenter.readModelItems(this.model.Items);

        $('body').append(this.$testHTML);
    },

    tearDown: function () {
        this.$testHTML.remove();
    },

    'test given correct model when validateModel is called then return configuration without error': function () {
        let configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isError);
    },

    'test given model with to many items when validateModel is called then return configuration with error and correct error code': function () {
        this.model = {
            Items: [
                {
                    Modules: "Text1",
                    Answers: "ans1\nans2\nans3"
                },
                {
                    Modules: "Text2",
                    Answers: "ans1\nans2\nans3"
                }
            ]
        };
        this.presenter.readModelItems(this.model.Items);

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NUMBER_ITEMS', configuration.errorCode);
    },

    'test given model with 0 items when validateModel is called then return configuration with error and correct error code': function () {
        this.model = {
            Items: []
        };
        this.presenter.readModelItems(this.model.Items);

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NUMBER_ITEMS', configuration.errorCode);
    },

    'test given model with incorrect modules when validateModel is called then return configuration with error and correct error code': function () {
        this.presenter.modulesIDs = ["Text12"];
        this.model.Items[0].Modules = "Text12";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_ID', configuration.errorCode);
    },

    'test given model with empty modules when validateModel is called then return configuration with error and correct error code': function () {
        this.presenter.modulesIDs = [""];
        this.model.Items[0].Modules = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NULL', configuration.errorCode);
    },

    'test given model with empty Answers when validateModel is called then return configuration with error and correct error code': function () {
        this.model.Items[0].Answers = "";

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NULL', configuration.errorCode);
    },

    'test given model with too many values in Answers when validateModel is called then return configuration with error and correct error code': function () {
        this.model.Items[0].Answers = "ans1\nans2\nans3\nans4";
        this.presenter.readModelItems(this.model.Items);

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NUMBER_GAP', configuration.errorCode);
    },

    'test given model with too few values in Answers when validateModel is called then return configuration with error and correct error code': function () {
        this.model.Items[0].Answers = "ans1\nans2";
        this.presenter.readModelItems(this.model.Items);

        let configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isError);
        assertEquals('INVALID_NUMBER_GAP', configuration.errorCode);
    },
});

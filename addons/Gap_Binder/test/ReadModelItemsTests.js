TestCase("[Gap Binder] Read Model Items tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();

        this.model = {
            Items: [
                {
                    Modules: "Text1, Text2,Text3",
                    Answers: "ans1\nans2\nans3"
                }
            ]
        };
    },

    'test given correct model when readItems is called set correct modulesIDs': function () {
        this.presenter.readModelItems(this.model.Items);

        assertEquals(["Text1", "Text2", "Text3"], this.presenter.modulesIDs);
    },

    'test given model with duplicated modules IDS when readItems is called then remove duplicates': function () {
        this.model.Items[0].Modules = "Text1, Text2, Text1";

        this.presenter.readModelItems(this.model.Items);

        assertEquals(["Text1", "Text2"], this.presenter.modulesIDs);
    },

    'test given correct model when readItems is called set correct answers': function () {
        this.presenter.readModelItems(this.model.Items);

        assertEquals(["ans1", "ans2", "ans3"], this.presenter.answers);
    },

    'test given model with duplicated answers when readItems is called than do not remove duplicates': function () {
        this.model.Items[0].Answers = "ans1\nans2\nans1";

        this.presenter.readModelItems(this.model.Items);

        assertEquals(["ans1", "ans2", "ans1"], this.presenter.answers);
    },
});

TestCase("[ModelViewer3D] Validate model tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
            "attributes": "",
            "annotations": ""
        };
    },

    'test given model with "enableFullscreen" as "False" when validating model then save value as false': function () {
        this.model["enableFullscreen"] = "False";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(false, configuration["enableFullscreen"]);
    },

    'test given model with "enableFullscreen" as "True" when validating model then save value as true': function () {
        this.model["enableFullscreen"] = "True";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(true, configuration["enableFullscreen"]);
    },

    'test given model with "modelIOS" as "example/path" when validating model then save value as string': function () {
        const EXAMPLE_PATH = "example/path";
        this.model["modelIOS"] = EXAMPLE_PATH;

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(EXAMPLE_PATH, configuration["modelIOS"]);
    }
});

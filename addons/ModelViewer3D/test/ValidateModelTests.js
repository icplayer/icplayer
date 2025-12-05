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
    },

    'test given model with undefined attributes when validating model then isValid is true': function () {
        delete this.model["attributes"];

        const configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
    },

    'test given model with null attributes when validating model then isValid is true': function () {
        this.model["attributes"] = null;

        const configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
    },

    'test given model with empty string attributes when validating model then isValid is true': function () {
        this.model["attributes"] = "";

        const configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
    },

    'test given model with whitespace only attributes when validating model then isValid is true': function () {
        this.model["attributes"] = "   ";

        const configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
    },

    'test given model with valid JSON attributes when validating model then additionalAttributes is parsed': function () {
        this.model["attributes"] = '{"key": "value"}';

        const configuration = this.presenter.validateModel(this.model);

        assertTrue(configuration.isValid);
        assertEquals("value", configuration.additionalAttributes["key"]);
    },

    'test given model with invalid JSON attributes when validating model then isValid is false': function () {
        this.model["attributes"] = '{invalid json}';

        const configuration = this.presenter.validateModel(this.model);

        assertFalse(configuration.isValid);
    }
});

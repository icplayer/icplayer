TestCase('[ModelViewer3D] Attributes tests', {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.modelViewer = $('<model-viewer></model-viewer>');
        this.presenter.configuration = getModel();
    },

    'test given model with attributes when handleAttributes was called should sets it on element': function () {
        this.presenter.handleAttributes();
        const element = this.presenter.modelViewer.get(0);

        assertTrue(element.hasAttribute("src"));
        assertTrue(element.hasAttribute("environment-image"));
        assertTrue(element.hasAttribute("shadow-softness"));
    },

    'test given additional attributes when handleAttributes was called should append attributes to element': function () {
        this.presenter.configuration.additionalAttributes = getAdditionalAttributes();

        this.presenter.handleAttributes();
        const element = this.presenter.modelViewer.get(0);

        assertTrue(element.hasAttribute("scale"));
    },
});

function getModel() {
    return {
        "model": "Alt text",
        "poster": "test 2",
        "skyboxImage": "",
        "environmentImage": "",
        "shadowIntensity": "",
        "shadowSoftness": "",
        "alt": "",
        "attributes": ""
    };
}

function getAdditionalAttributes() {
    return {
        "scale": "0.1 0.2 0.3"
    };
}

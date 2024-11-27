TestCase('[ModelViewer3D] Attributes tests', {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.modelViewer = document.createElement("model-viewer");
        this.presenter.configuration = getModel();
    },

    'test given model with attributes when handleAttributes was called should sets it on element': function () {
        this.presenter.handleAttributes();

        assertTrue(this.presenter.modelViewer.hasAttribute("src"));
        assertTrue(this.presenter.modelViewer.hasAttribute("environment-image"));
        assertTrue(this.presenter.modelViewer.hasAttribute("shadow-softness"));
    },

    'test given additional attributes when handleAttributes was called should append attributes to element': function () {
        this.presenter.configuration.additionalAttributes = getAdditionalAttributes();

        this.presenter.handleAttributes();

        assertTrue(this.presenter.modelViewer.hasAttribute("scale"));
    },

    'test given mocked iOS device when handleAttributes was called should append xr-environment attribute to element': function () {
        const isMobileIOSStub = sinon.stub();
        isMobileIOSStub.returns(true);
        this.presenter.isMobileIOS = isMobileIOSStub;

        this.presenter.handleAttributes();

        assertTrue(this.presenter.modelViewer.hasAttribute("xr-environment"));
    },

    'test given mocked iOS device and modelIOS when handleAttributes was called should append ios-src attribute to element': function () {
        const isMobileIOSStub = sinon.stub();
        isMobileIOSStub.returns(true);
        this.presenter.isMobileIOS = isMobileIOSStub;
        this.presenter.configuration.modelIOS = 'example/path';

        this.presenter.handleAttributes();

        assertTrue(this.presenter.modelViewer.hasAttribute("ios-src"));
        assertEquals('example/path', this.presenter.modelViewer.getAttribute("ios-src"));
    }
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

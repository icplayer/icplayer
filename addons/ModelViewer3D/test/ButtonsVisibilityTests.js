TestCase('[ModelViewer3D] Button visibility tests', {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.presenter.labelsButton = $('<div></div>');
        this.presenter.copyButton = $('<div></div>');
    },

    'test given model with empty annotations when handleDisplayingButtons was called should add hidden class to labelsButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": ""
        };

        this.presenter.handleDisplayingButtons();
        const hasLabelsBtnHiddenClass = this.presenter.labelsButton.hasClass('hidden');

        assertTrue(hasLabelsBtnHiddenClass);
    },

    'test given model with empty copyInfo when handleDisplayingButtons was called should add hidden class to copyButton': function () {
        this.presenter.configuration = {
            "annotations": "",
            "copyInfo": ""
        };

        this.presenter.handleDisplayingButtons();
        const hasCopyBtnHiddenClass = this.presenter.copyButton.hasClass('hidden');

        assertTrue(hasCopyBtnHiddenClass);
    },
});

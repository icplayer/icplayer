TestCase("[eKeyboard] Model validation", {
    setUp: function () {
        this.presenter = AddoneKeyboard_create();
        this.presenter.getAllPageModulesIds = () => ['Text1', 'Text2', 'MultipleGap1'];
        this.presenter.playerController = {};
        this.presenter.playerController.getModule = (id) => {
            if (id === 'Text1') {
                return { getView: () => "input" }
            } else return {};
        };
    },

    'test given model without upgradeable items when upgrading then add them': function () {
        const model = {
            'ID': 'eKeyboard1',
            'isError': 'False',
            'workWithViews': '[]',
            'layoutType': '',
            'customLayout': '',
            'positionAt': '',
            'positionMy': '',
            'maxCharacters': '10',
            'offset': '',
            'openOnFocus': 'False',
            'lockInput': 'False',
            'showCloseButton': 'False'
        }
        const expectedUpgradedModel = {
            ...model,
            'worksWithAll': 'False',
            'customDisplay': ''
        };

        const upgradeModel = this.presenter.upgradeModel(model);

        assertEquals(expectedUpgradedModel.customDisplay, upgradeModel.customDisplay);
        assertEquals(expectedUpgradedModel.worksWithAll, upgradeModel.worksWithAll);
    },

    'test given model with worksWithAll true when validating then add all page modules with getView to works with list': function () {
        const model = {
            'ID': 'eKeyboard1',
            'isError': 'False',
            'workWithViews': '[]',
            'layoutType': '',
            'customLayout': '',
            'positionAt': '',
            'positionMy': '',
            'maxCharacters': '10',
            'offset': '',
            'openOnFocus': 'False',
            'lockInput': 'False',
            'showCloseButton': 'False',
            'worksWithAll': 'True',
            'customDisplay': '',
        }

        const validationResult = this.presenter.validateModel(model, false);
        const expectedWorkWithViews = [this.presenter.playerController.getModule("Text1").getView()];

        assertEquals(expectedWorkWithViews, validationResult.workWithViews);
    }
});

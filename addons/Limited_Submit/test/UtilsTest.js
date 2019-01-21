TestCase('[Limited_Submit] Utils tests', {
    setUp: function () {
        function generateModule () {
            return {
                setShowErrorsMode: sinon.stub(),
                setWorkMode: sinon.stub(),
                isAttempted: sinon.stub().returns(true)
            }
        }


        this.presenter = AddonLimited_Submit_create();

        this.modulesConfiguration = {
            'firstModule': generateModule(),
            'secondModule': generateModule(),
            'thirdModule':  generateModule(),
            'andAnotherModule': generateModule(),
            'differentModule': generateModule(),
            'anotherModule': generateModule()
        };

        this.presenter.playerController = {
            getModule: function (moduleId) {
                return this.modulesConfiguration[moduleId];
            }.bind(this)
        };

        this.presenter.configuration = {};
        this.presenter.configuration.worksWithModulesList = Object.keys(this.modulesConfiguration);
    },

    'test given list of modules when executeCheckForAllModules is called then all modules which exists and with setWorkMode will be called': function () {
        var excluded = 'firstModule';
        this.presenter.configuration.worksWithModulesList.push('superNotExistingModule');

        assertNotEquals(undefined, this.modulesConfiguration[excluded]);

        this.modulesConfiguration[excluded] = {};

        this.presenter.executeCheckForAllModules();

        for (var key in this.modulesConfiguration) {
            if (this.modulesConfiguration.hasOwnProperty(key)) {
                if (key !== excluded) {
                    assertTrue(this.modulesConfiguration[key].setShowErrorsMode.calledOnce)
                }
            }
        }
    },

    'test given list of modules when executeUnCheckForAllModules is called then all modules which exists and with setWorkMode will be called': function () {
        var excluded = 'firstModule';
        this.presenter.configuration.worksWithModulesList.push('superNotExistingModule');

        assertNotEquals(undefined, this.modulesConfiguration[excluded]);

        this.modulesConfiguration[excluded] = {};

        this.presenter.executeUnCheckForAllModules();

        for (var key in this.modulesConfiguration) {
            if (this.modulesConfiguration.hasOwnProperty(key)) {
                if (key !== excluded) {
                    assertTrue(this.modulesConfiguration[key].setWorkMode.calledOnce)
                }
            }
        }
    },

    'test given list of modules when allModulesAttempted is called then will check only modules which exists and contains isAttempted method': function () {
        var excluded = 'firstModule';
        this.presenter.configuration.worksWithModulesList.push('superNotExistingModule');

        assertNotEquals(undefined, this.modulesConfiguration[excluded]);

        this.modulesConfiguration[excluded] = {};

        this.presenter.allModulesAttempted();

        for (var key in this.modulesConfiguration) {
            if (this.modulesConfiguration.hasOwnProperty(key)) {
                if (key !== excluded) {
                    assertTrue(this.modulesConfiguration[key].isAttempted.calledOnce)
                }
            }
        }
    },

    'test given list of attempted modules when allModulesAttempted is called then will return true': function () {
        assertTrue(this.presenter.allModulesAttempted());
    },

    'test given list of unattempted modules when allModulesAttempted is called then will return false': function () {
        for (var key in this.modulesConfiguration) {
            if (this.modulesConfiguration.hasOwnProperty(key)) {
                this.modulesConfiguration[key].isAttempted = sinon.stub().returns(false);
            }
        }

        assertFalse(this.presenter.allModulesAttempted());
    },

    'test given list of modules where one of them is unattempted when allModulesAttempted is called when will return false': function () {
        assertNotEquals(undefined, this.modulesConfiguration['andAnotherModule']);
        this.modulesConfiguration['andAnotherModule'].isAttempted = sinon.stub().returns(false);

        assertFalse(this.presenter.allModulesAttempted());
    }
});
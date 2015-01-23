TestCase('[TextAudio] Upgrade model', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test both playPart and playSeparateFiles option are deselected but present': function () {
        var model = {
            playPart: 'False',
            playSeparateFiles: 'False'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment, upgradedModel.clickAction);
    },

    'test only playPart option is selected': function () {
        var model = {
            playPart: 'True',
            playSeparateFiles: 'False'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval, upgradedModel.clickAction);
    },

    'test only playSeparateFiles option is selected': function () {
        var model = {
            playPart: 'False',
            playSeparateFiles: 'True'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_vocabulary_file, upgradedModel.clickAction);
    },

    'test both playPart and playSeparateFiles option are selected': function () {
        var model = {
            playPart: 'True',
            playSeparateFiles: 'True'
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval_or_vocabulary, upgradedModel.clickAction);
    },

    'test both playPart and playSeparateFiles are not present in model but separateFiles list is': function () {
        var model = {
            separateFiles: []
        };

        var upgradedModel = this.presenter.upgradeClickAction(model);

        assertEquals(this.presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment, upgradedModel.clickAction);
    }
});
TestCase("[Commons - Statefull Addon Object] Abstract methods", {
    setUp: function () {
        this.statefullAddonObject = new StatefullAddonObject({});
    },

    'test onBlock should be a abstract method': function () {
        try {
            this.statefullAddonObject.onBlock();
            fail("onBlock should be abstract method!")
        } catch (e) {

        }
    },

    'test onUnblock should be a abstract method': function () {
        try {
            this.statefullAddonObject.onUnblock();
            fail("onUnblock should be abstract method!")
        } catch (e) {

        }
    },

    'test isCorrect should be a abstract method': function () {
        try {
            this.statefullAddonObject.isCorrect();
            fail("isCorrect should be abstract method!")
        } catch (e) {

        }
    },

    'test onWrong should be a abstract method': function () {
        try {
            this.statefullAddonObject.onWrong();
            fail("onWrong should be abstract method!")
        } catch (e) {

        }
    },

    'test onCorrect should be a abstract method': function () {
        try {
            this.statefullAddonObject.onCorrect();
            fail("onCorrect should be abstract method!")
        } catch (e) {

        }
    },

    'test onShowAnswers should be a abstract method': function () {
        try {
            this.statefullAddonObject.onShowAnswers();
            fail("onShowAnswers should be abstract method!")
        } catch (e) {

        }
    },

    'test onHideAnswers should be a abstract method': function () {
        try {
            this.statefullAddonObject.onHideAnswers();
            fail("onHideAnswers should be abstract method!")
        } catch (e) {

        }
    },

    'test onReset should be a abstract method': function () {
        try {
            this.statefullAddonObject.onReset();
            fail("onReset should be abstract method!")
        } catch (e) {

        }
    },

    'test onUnWrong should be a abstract method': function () {
        try {
            this.statefullAddonObject.onUnWrong();
            fail("onUnWrong should be abstract method!")
        } catch (e) {

        }
    },

    'test onUnCorrect should be a abstract method': function () {
        try {
            this.statefullAddonObject.onUnCorrect();
            fail("onUnCorrect should be abstract method!")
        } catch (e) {

        }
    }
});
TestCase("[Speechace] Test runLogic method", {
    setUp: function () {
        this.presenter = AddonSpeechace_create();

        this.stubs = {
            handleURLLogic: sinon.stub(this.presenter, "handleURLLogic"),
            createErrorView: sinon.stub(this.presenter, "createErrorView")
        };

        this.spies = {
            runLogic: sinon.spy(this.presenter, 'runLogic')
        };

        this.clock = sinon.useFakeTimers();
    },

    'test given no player controller when runLogic called then function called numberOfCalls times and then default values set': function () {
        var numberOfCalls = 3;

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(numberOfCalls * 500 + 1);

        assertTrue(this.stubs.handleURLLogic.calledOnce);
        assertEquals(this.spies.runLogic.callCount, numberOfCalls + 1);
        assertEquals(this.presenter.JWTSessionTokenURL, this.presenter.DEFAULTS.JWTSessionTokenURL);
        assertEquals(this.presenter.speechaceCourseURL, this.presenter.DEFAULTS.speechaceCourseURL);
        assertEquals(this.presenter.collectionID, this.presenter.DEFAULTS.collectionId);
    },

    'test given player controller with undefined contextMetadata when runLogic called then function called numberOfCalls times and then default values set': function () {
        var numberOfCalls = 3;
        this.presenter.playerController = {
            getContextMetadata: () => {return null;}
        };

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(numberOfCalls * 500 + 1);

        assertTrue(this.stubs.handleURLLogic.calledOnce);
        assertEquals(this.spies.runLogic.callCount, numberOfCalls + 1);
        assertEquals(this.presenter.JWTSessionTokenURL, this.presenter.DEFAULTS.JWTSessionTokenURL);
        assertEquals(this.presenter.speechaceCourseURL, this.presenter.DEFAULTS.speechaceCourseURL);
        assertEquals(this.presenter.collectionID, this.presenter.DEFAULTS.collectionId);
    },

    'test given contextMetadata with just JWT url when runLogic called then function called once and errorViewCreated': function () {
        var numberOfCalls = 3;
        var contextMetadata = {
            JWTSessionTokenURL: "some/jwt/url"
        };
        this.presenter.playerController = {
            getContextMetadata: () => {return contextMetadata;}
        };

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(500);

        assertFalse(this.stubs.handleURLLogic.called);
        assertTrue(this.stubs.createErrorView.calledOnce);
        assertTrue(this.spies.runLogic.calledOnce);

        assertEquals(this.presenter.JWTSessionTokenURL, contextMetadata.JWTSessionTokenURL);
        assertEquals(this.presenter.speechaceCourseURL, "");
        assertEquals(this.presenter.collectionID, this.presenter.DEFAULTS.collectionId);
    },

    'test given contextMetadata with just Course URL when runLogic called then function called once and errorViewCreated': function () {
        var numberOfCalls = 3;
        var contextMetadata = {
            speechaceCourseURL: "some/course/url"
        };
        this.presenter.playerController = {
            getContextMetadata: () => {return contextMetadata;}
        };

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(500);

        assertFalse(this.stubs.handleURLLogic.called);
        assertTrue(this.stubs.createErrorView.calledOnce);
        assertTrue(this.spies.runLogic.calledOnce);

        assertEquals(this.presenter.JWTSessionTokenURL, "");
        assertEquals(this.presenter.speechaceCourseURL, contextMetadata.speechaceCourseURL);
        assertEquals(this.presenter.collectionID, this.presenter.DEFAULTS.collectionId);
    },

    'test given contextMetadata with both mandatory URLs when runLogic called then function called once and successfully proceeded': function () {
        var numberOfCalls = 3;
        var contextMetadata = {
            JWTSessionTokenURL: "some/jwt/url",
            speechaceCourseURL: "some/course/url"
        };
        this.presenter.playerController = {
            getContextMetadata: () => {return contextMetadata;}
        };

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(500);

        assertTrue(this.stubs.handleURLLogic.calledOnce);
        assertFalse(this.stubs.createErrorView.called);
        assertTrue(this.spies.runLogic.calledOnce);

        assertEquals(this.presenter.JWTSessionTokenURL, contextMetadata.JWTSessionTokenURL);
        assertEquals(this.presenter.speechaceCourseURL, contextMetadata.speechaceCourseURL);
        assertEquals(this.presenter.collectionID, this.presenter.DEFAULTS.collectionId);
    },

    'test given contextMetadata with both mandatory URLs and additional collectionID when runLogic then function called once and successfully proceeded': function () {
        var numberOfCalls = 3;
        var contextMetadata = {
            JWTSessionTokenURL: "some/jwt/url",
            speechaceCourseURL: "some/course/url",
            collectionID: "36918698"
        };
        this.presenter.playerController = {
            getContextMetadata: () => {return contextMetadata;}
        };

        this.presenter.runLogic(numberOfCalls);

        this.clock.tick(500);

        assertTrue(this.stubs.handleURLLogic.calledOnce);
        assertFalse(this.stubs.createErrorView.called);
        assertTrue(this.spies.runLogic.calledOnce);

        assertEquals(this.presenter.JWTSessionTokenURL, contextMetadata.JWTSessionTokenURL);
        assertEquals(this.presenter.speechaceCourseURL, contextMetadata.speechaceCourseURL);
        assertEquals(this.presenter.collectionID, contextMetadata.collectionID);
    }
});
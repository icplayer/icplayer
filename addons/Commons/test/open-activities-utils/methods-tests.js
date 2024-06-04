TestCase("[Commons - Open activities utils] Methods tests", {
    setUp:  function () {
        this.playerController = null;
        this.pageID = "AAA";
        this.moduleID = "BBB";
    },

    /**
     Mockup playerController with all data needed in methods.
     @method setUpPlayerController

     @param {boolean} isOpenActivitiesEnabled is open activities enabled
     @param {object} aiReadyConfiguration List of modules for witch AI model is ready
            example: [
                {
                    "page_id": "hb6ed5Xnuhg1Q3Wl",
                    "activity_id": "Paragraph1"
                },
                {
                    "page_id": "hb6ed5Xnuhg1Q3Wl",
                    "activity_id": "Paragraph2"
                }
            ]
     @param {object} openActivityScore Dict with AI graded score and manual graded score
            example: {
                "manualGradedScore": "1",
                "aiGradedScore": "2"
            }
    */
    setUpPlayerController: function (isOpenActivitiesEnabled, aiReadyConfiguration, openActivityScore) {
        this.playerController = {
            getContextMetadata: function () {
                return {
                    isOpenActivitiesEnabled: isOpenActivitiesEnabled,
                    aiReady: aiReadyConfiguration
                };
            },
            getScore: function () {
                return {
                    getOpenActivityScores: function (pageID, moduleID) {
                        return openActivityScore;
                    }
                };
            }
        };
    },

    setUpExampleOfAIReadyList: function () {
        this.aiReadyList = [this.createAIReadyListEntry(this.pageID, this.moduleID)];
    },

    createAIReadyListEntry: function (pageID, moduleID) {
        return {
            "page_id": pageID,
            "activity_id": moduleID
        };
    },

    createOpenActivityScore: function (manualGradedScore, aiGradedScore) {
        return {
            "manualGradedScore": manualGradedScore,
            "aiGradedScore": aiGradedScore
        };
    },

    'test given context metadata without isOpenActivitiesEnabled information when executing isEnabled then return false': function () {
        this.playerController = {
            getContextMetadata: function () {},
        };

        const result = OpenActivitiesUtils.isEnabled(this.playerController);

        assertFalse(result);
    },

    'test given enabled open activities when executing isEnabled then return true': function () {
        this.setUpPlayerController(true, null, null);

        const result = OpenActivitiesUtils.isEnabled(this.playerController);

        assertTrue(result);
    },

    'test given disabled open activities when executing isEnabled then return false': function () {
        this.setUpPlayerController(false, null, null);

        const result = OpenActivitiesUtils.isEnabled(this.playerController);

        assertFalse(result);
    },

    'test given context metadata without isOpenActivitiesEnabled and aiReady when executing isAIModelReady then return false': function () {
        this.playerController = {
            getContextMetadata: function () {},
        };

        const result = OpenActivitiesUtils.isAIModelReady(this.playerController, this.pageID, this.moduleID);

        assertFalse(result);
    },

    'test given context metadata with isOpenActivitiesEnabled and without aiReady when executing isAIModelReady then return false': function () {
        this.playerController = {
            getContextMetadata: function () {
                return {
                    isOpenActivitiesEnabled: true,
                };
            },
        };

        const result = OpenActivitiesUtils.isAIModelReady(this.playerController, this.pageID, this.moduleID);

        assertFalse(result);
    },

    'test given module at AI ready list when executing isAIModelReady then return true': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(false, this.aiReadyList, null);

        const result = OpenActivitiesUtils.isAIModelReady(this.playerController, this.pageID, this.moduleID);

        assertTrue(result);
    },

    'test given module not at AI ready list when executing isAIModelReady then return false': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(false, this.aiReadyList, null);

        const result1 = OpenActivitiesUtils.isAIModelReady(this.playerController, "LLL", this.moduleID);
        const result2 = OpenActivitiesUtils.isAIModelReady(this.playerController, this.pageID, "OOO");
        const result3 = OpenActivitiesUtils.isAIModelReady(this.playerController, "LLL", "OOO");

        assertFalse(result1);
        assertFalse(result2);
        assertFalse(result3);
    },

    'test given enabled open activities and module at AI ready list when executing isAIReady then return true': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, null);

        const result = OpenActivitiesUtils.isAIReady(this.playerController, this.pageID, this.moduleID);

        assertTrue(result);
    },

    'test given disabled open activities and module at AI ready list when executing isAIReady then return false': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(false, this.aiReadyList, null);

        const result = OpenActivitiesUtils.isAIReady(this.playerController, this.pageID, this.moduleID);

        assertFalse(result);
    },

    'test given enabled open activities and module not at AI ready list when executing isAIReady then return false': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, null);

        const result1 = OpenActivitiesUtils.isAIReady(this.playerController, "LLL", this.moduleID);
        const result2 = OpenActivitiesUtils.isAIReady(this.playerController, this.pageID, "OOO");
        const result3 = OpenActivitiesUtils.isAIReady(this.playerController, "LLL", "OOO");

        assertFalse(result1);
        assertFalse(result2);
        assertFalse(result3);
    },

    'test given context metadata without isOpenActivitiesEnabled when executing getOpenActivityScore then return 0': function () {
        this.playerController = {
            getContextMetadata: function () {},
        };

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(0, result);
    },

    'test given disabled open activities and module at AI ready list and with both scores when executing getOpenActivityScore then return 0': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(false, this.aiReadyList, this.createOpenActivityScore(1, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(0, result);
    },

    'test given enabled open activities and module at AI ready list and with both scores when executing getOpenActivityScore then return manual graded score': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, this.createOpenActivityScore(1, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(1, result);
    },

    'test given enabled open activities and module at AI ready list and with both scores when executing getOpenActivityScore then return manual graded score when is 0': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, this.createOpenActivityScore(0, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(0, result);
    },

    'test given enabled open activities and module at AI ready list and with manual graded score when executing getOpenActivityScore then return manual graded score': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, this.createOpenActivityScore(1, null));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(1, result);
    },

    'test given enabled open activities and module at AI ready list and with AI graded score when executing getOpenActivityScore then return AI graded score': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, this.createOpenActivityScore(null, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(2, result);
    },

    'test given enabled open activities and module not at AI ready list and with both scores when executing getOpenActivityScore then return manual graded score': function () {
        this.setUpPlayerController(true, null, this.createOpenActivityScore(1, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(1, result);
    },

    'test given enabled open activities and module not at AI ready list and with manual graded score when executing getOpenActivityScore then return manual graded score': function () {
        this.setUpPlayerController(true, null, this.createOpenActivityScore(1, null));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(1, result);
    },

    'test given enabled open activities and module not at AI ready list and with AI graded score when executing getOpenActivityScore then return AI graded score': function () {
        this.setUpPlayerController(true, null, this.createOpenActivityScore(null, 2));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(2, result);
    },

    'test given enabled open activities and module at AI ready list and without scores when executing getOpenActivityScore then 0': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, null);

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(0, result);
    },

    'test given enabled open activities and module at AI ready list and scores as nulls when executing getOpenActivityScore then 0': function () {
        this.setUpExampleOfAIReadyList();
        this.setUpPlayerController(true, this.aiReadyList, this.createOpenActivityScore(null, null));

        const result = OpenActivitiesUtils.getOpenActivityScore(this.playerController, this.pageID, this.moduleID);

        assertEquals(0, result);
    },
});

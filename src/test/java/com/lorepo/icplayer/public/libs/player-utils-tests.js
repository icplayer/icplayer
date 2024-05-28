TestCase("Player Utils", {
    setUp: function () {
        this.player = {
            getPlayerServices: function () { }
        };

        this.playerServices = {
            getScore: function () {},
            getPresentation: function () {},
            getTimeService: function () {}
        };

        this.scoreService = {
            getPageScoreWithoutOpenActivitiesById: function () {}
        };

        this.timeService = {
            getTotalTime: function () {},
        };

        sinon.stub(this.player, 'getPlayerServices');
        sinon.stub(this.playerServices, 'getScore');
        sinon.stub(this.playerServices, 'getPresentation');
        sinon.stub(this.playerServices, 'getTimeService');
        sinon.stub(this.scoreService, 'getPageScoreWithoutOpenActivitiesById');
        sinon.stub(this.timeService, 'getTotalTime');

        this.player.getPlayerServices.returns(this.playerServices);
        this.playerServices.getScore.returns(this.scoreService);
        this.playerServices.getTimeService.returns(this.timeService);

        this.scoreService.getPageScoreWithoutOpenActivitiesById.withArgs('Page1').returns({
            score: 1,
            maxScore: 4,
            mistakeCount: 3,
            checkCount: 2,
            errorCount: 2
        });

        this.scoreService.getPageScoreWithoutOpenActivitiesById.withArgs('Page2').returns({
            score: 2,
            maxScore: 3,
            mistakeCount: 1,
            checkCount: 3,
            errorCount: 1
        });

        this.timeService.getTotalTime.returns("1");
    },

    'test player object not defined': function () {
        try {
            var playerUtils = new PlayerUtils(undefined);

            fail('Constructor should throw an exception');
        } catch (exception) {
            assertInstanceOf(TypeError, exception);
        }
    },

    'test proper utils construction': function () {
        var playerUtils = new PlayerUtils(this.player);

        assertNotUndefined(playerUtils);
        assertTrue(this.player.getPlayerServices.calledOnce);
        assertTrue(this.playerServices.getScore.calledOnce);
    },

    'test get presentation object': function () {
        var playerUtils = new PlayerUtils(this.player);

        playerUtils.getPresentation();

        assertTrue(this.playerServices.getPresentation.calledOnce);
    },

    'test presentation with none reportable pages': function () {
        var playerUtils = new PlayerUtils(this.player),
            presentation = {
                getPageCount: function () { return 1; },
                getPage: function () {
                    return {
                        isReportable: function () { return false; }
                    }
                }
            };


        var score = playerUtils.getPresentationScore(presentation);

        assertEquals(0, score.minScore);
        assertEquals(0, score.maxScore);
        assertEquals(0, score.rawScore);
        assertEquals(0, score.scaledScore);
        assertEquals(0, score.errorsCount);
        assertEquals(0, score.checksCount);
    },

    'test one reportable page': function () {
        var playerUtils = new PlayerUtils(this.player),
            presentation = {
                getPageCount: function () { return 2; },
                getPage: function (i) {
                    if (i == 0) {
                        return {
                            isReportable: function () { return false; },
                            getName: function () { return "Page 1" },
                            getId: function () { return "Page1" },
                            getPageWeight: function () {return 1}
                        }
                    }

                    return {
                        isReportable: function () { return true; },
                        isVisited: function () { return true; },
                        getName: function () { return "Page 2" },
                        getId: function () { return "Page2" },
                        getPageWeight: function () {return 1}
                    }
                }
            };


        var score = playerUtils.getPresentationScore(presentation);

        assertEquals(0, score.minScore);
        assertEquals(1, score.maxScore);
        assertEquals(2 / 3, score.rawScore);
        assertEquals(0.67, score.scaledScore);
        assertEquals(0.6666666666666666, score.floatScore);
        assertEquals(1, score.errorsCount);
        assertEquals(3, score.checksCount);
    },

    'test all reportable pages': function () {
        var playerUtils = new PlayerUtils(this.player),
            presentation = {
                getPageCount: function () { return 2; },
                getPage: function (i) {
                    if (i == 0) {
                        return {
                            isReportable: function () { return true; },
                            isVisited: function () { return true; },
                            getName: function () { return "Page 1" },
                            getId: function () { return "Page1" },
                            getPageWeight: function () {return 1}
                        }
                    }

                    return {
                        isReportable: function () { return true; },
                        getName: function () { return "Page 2" },
                        getId: function () { return "Page2" },
                        getPageWeight: function () {return 1}
                    }
                }
            };


        var score = playerUtils.getPresentationScore(presentation);

        assertEquals(0, score.minScore);
        assertEquals(2, score.maxScore);
        assertEquals((2 / 3 + 1 / 4), score.rawScore);
        assertEquals(0.46, score.scaledScore);
        assertEquals(0.4583333333333333, score.floatScore);
        assertEquals(3, score.errorsCount);
        assertEquals(5, score.checksCount);
        assertEquals(2, score.paginatedResult[1].absolute_score);
        assertEquals(3, score.paginatedResult[1].max_score);
        assertEquals(0.67, score.paginatedResult[1].score);
    }
});
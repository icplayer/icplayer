TestCase("Player Utils with unavailable API", {
    'test utils construction with empty object': function () {
        var playerUtils = new PlayerUtils({ });

        assertNotUndefined(playerUtils);
        assertUndefined(playerUtils.getPresentation());
        assertUndefined(playerUtils.getPresentationScore());
    },

    'test get presentation from empty object': function () {
        var playerUtils = new PlayerUtils({});

        assertUndefined(playerUtils.getPresentation());

       },

    'test presentation score from empty object': function () {
        var playerUtils = new PlayerUtils({}),
            score = playerUtils.getPresentationScore(undefined);

        assertUndefined(score);

    }


});

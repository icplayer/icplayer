

TestCase("[Catch] Utils validation", {
    setUp: function () {
        this.presenter = AddonCatch_create();
        this.model = {
            'Items': [{
                'Image': '/file/serve/5511233314750464',
                'Description': 'rubber',
                'Is Correct': 'True',
                'Level': '1,2'
            }, {
                'Image': '/file/serve/4596439640440832',
                'Description': 'cat',
                'Is Correct': 'False',
                'Level': '2,3'
            }],
            'Item_Width': '20',
            'Item_Height': '20'
        };
    },

    'test validate correct items model' : function () {
        var validated = this.presenter.validateModel(this.model);
        var levels = this.presenter.calculateLevelsItems(validated.items);

        var levelOne = levels[0];
        assertEquals('/file/serve/5511233314750464', levelOne[0].image);
        assertEquals('rubber', levelOne[0].description);
        assertTrue(levelOne[0].isCorrect);
        assertEquals(1, levelOne[0].levels[0]);
        assertEquals(2, levelOne[0].levels[1]);

        var levelThree = levels[2];
        assertEquals('/file/serve/4596439640440832', levelThree[0].image);
        assertEquals('cat', levelThree[0].description);
        assertFalse(levelThree[0].isCorrect);
        assertEquals(2, levelThree[0].levels[0]);
        assertEquals(3, levelThree[0].levels[1]);
    }

});

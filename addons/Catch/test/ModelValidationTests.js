TestCase("[Catch] Model validation", {
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
            'Points to finish': '3',
            'Item_Width': '20',
            'Item_Height': '20',
            'Plate image': '/file/serve/4596439640440880'
        };
    },

    'test validate correct items model' : function () {
        var validated = this.presenter.validateModel(this.model);
        assertTrue(validated.isValid);

        assertEquals('/file/serve/5511233314750464', validated.items[0].image);
        assertEquals('rubber', validated.items[0].description);
        assertTrue(validated.items[0].isCorrect);
        assertEquals(1, validated.items[0].levels[0]);
        assertEquals(2, validated.items[0].levels[1]);

        assertEquals('/file/serve/4596439640440832', validated.items[1].image);
        assertEquals('cat', validated.items[1].description);
        assertFalse(validated.items[1].isCorrect);
        assertEquals(2, validated.items[1].levels[0]);
        assertEquals(3, validated.items[1].levels[1]);

        assertEquals(3, validated.pointsToFinish);
        assertEquals('/file/serve/4596439640440880', validated.plateImage);
    },

    'test empty image property' : function () {
        this.model['Items'][0]['Image'] = '';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('I01', validated.errorCode);
    },

    'test too long description' : function () {
        this.model['Items'][0]['Description'] = 'abcdefghijklmnopqrstuvwxyz';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('D01', validated.errorCode);
    },

    'test empty level property' : function () {
        this.model['Items'][0]['Level'] = '';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('L01', validated.errorCode);
    },

    'test wrong range property level' : function () {
        this.model['Items'][0]['Level'] = '0,1';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('L02', validated.errorCode);
    },

    'test none-number value in points to finish property' : function () {
        this.model['Points to finish'] = 'random string';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('P01', validated.errorCode);
    },

    'test empty items property' : function () {
        this.model['Items'] = '';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('O01', validated.errorCode);
    },

    'test empty itemWidth property' : function () {
        this.model['Item_Width'] = '';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('W01', validated.errorCode);
    },

    'test empty itemHeight property' : function () {
        this.model['Item_Height'] = '';
        var validated = this.presenter.validateModel(this.model);

        assertFalse(validated.isValid);
        assertEquals('W01', validated.errorCode);
    }

});

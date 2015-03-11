TestCase("[Multiple Gap] Player Services utils", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.playerController = {
            getModule: function () {}
        };

        sinon.stub(this.presenter.playerController, 'getModule');
    },

    tearDown: function () {
        this.presenter.playerController.getModule.restore();
    },

    'test getting image URL from Image Source that does not exist': function () {
        this.presenter.playerController.getModule.returns(null);

        var imageURL = this.presenter.getImageURL({item: 'Image source1'});

        assertEquals('', imageURL);
    },

    'test getting image URL from module that is not Image Source': function () {
        this.presenter.playerController.getModule.returns({});

        var imageURL = this.presenter.getImageURL({item: 'Text1'});

        assertEquals('', imageURL);
    },

    'test getting image URL from properly configured Image Source': function () {
        this.presenter.playerController.getModule.returns({
            getImageUrl: function () {
                return '/file/serve/123456';
            }
        });

        var imageURL = this.presenter.getImageURL({item: 'Image source1'});

        assertEquals('/file/serve/123456', imageURL);
    },

    'test getting element text from Source List that does not exist': function () {
        this.presenter.playerController.getModule.returns(null);

        var imageURL = this.presenter.getElementText('Source-list1', '1');

        assertEquals('', imageURL);
    },

    'test getting element text from module that is not Source List': function () {
        this.presenter.playerController.getModule.returns({});

        var imageURL = this.presenter.getElementText('Text1', '1');

        assertEquals('', imageURL);
    },

    'test getting element text from properly configured Source List': function () {
        this.presenter.playerController.getModule.returns({
            getItem: function () {
                return 'Source list 1st element';
            }
        });

        var imageURL = this.presenter.getElementText('Source-list1', '1');

        assertEquals('Source list 1st element', imageURL);
    }
});
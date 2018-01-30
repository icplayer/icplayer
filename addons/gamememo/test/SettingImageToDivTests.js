TestCase("[gamememo] Setting image for div", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        var divElement = document.createElement("div");
        this.div = $(divElement);
        this.image = "image";
    },

    'test should set image as background css when imageMode is stretch': function () {
        this.presenter.imageMode = 'Stretch';

        this.presenter.setDivImage(this.div, this.image);

        var expectedBackground = 'url("image") 0% 0% / 100% 100%';

        assertEquals(expectedBackground, this.div.css('background'));
    },

    'test should set image as img element when imageMode is KeepAspect': function () {
        this.presenter.imageMode = 'KeepAspect';

        this.presenter.setDivImage(this.div, this.image);

        var imageElement = this.div.find('img');

        assertEquals(1, imageElement.length);
        assertEquals('image', imageElement.attr('src'));
    },

    'test should set image as img element when imageMode is other': function () {
        this.presenter.imageMode = '';

        this.presenter.setDivImage(this.div, this.image);

        var expectedBackground = 'url("image")';

        assertEquals(expectedBackground, this.div.css('background'));
    },

    'test should add span to div when alttext is specified': function () {
        var altText = 'altText';
        var spanClass = 'gamememo_alt_text';

        this.presenter.setDivImage(this.div, this.image, altText);

        var span = this.div.find('span');

        assertEquals(1, span.length);
        assertEquals(altText, span.text());
        assertEquals(spanClass, span.attr('class'));
    },

    'test should not add span to div when alttext is undefined': function () {
        this.presenter.setDivImage(this.div, this.image);

        var span = this.div.find('span');

        assertEquals(0, span.length);
    },
});

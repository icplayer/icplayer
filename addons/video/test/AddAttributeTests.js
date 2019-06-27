AddAttributeTests = TestCase("[Video] Add Attribute");

AddAttributeTests.prototype.setUp = function() {
    this.presenter = Addonvideo_create();

    this.video = $("<video></video>")[0];
    this.presenter.$view = $("<div></div>");
    this.posterWrapper = $("<div></div>");
    this.posterWrapper.addClass('poster-wrapper');

    this.posterWrapper.append($("<img></img>"));

    this.presenter.$view.append(this.posterWrapper);
    this.presenter.configuration = {};
    this.presenter.configuration.addonSize = {
        width: 30,
        height: 50
    };

    this.presenter.$posterWrapper = this.posterWrapper;
};

AddAttributeTests.prototype.testAddingPosterShouldSetValidPoster = function() {
    this.presenter.metadadaLoaded = true;
    this.presenter.getVideoSize = function (){ 
        return {
            width: 20,
            height: 30
        };
    };

    var image = new Image();
    image.src = "some_url";

    this.presenter.addAttributePoster(this.video, image);

    /** @type {jQuery} */
    var image = this.presenter.$view.find("img");

    assertEquals(image.length, 1);
    assertEquals(image.width(), 20);
    assertEquals(image.height(), 30);  
    assertEquals(image.attr('src'), "some_url");

    assertEquals('5px', image.css('left'));
    assertEquals('10px', image.css('top'));
};
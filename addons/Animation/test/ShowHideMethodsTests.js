ShowHideMethodsTests = TestCase("Show and Hide Methods Tests");

ShowHideMethodsTests.prototype.setUp = function() {
    this.presenter = AddonAnimation_create();
    this.presenter.configuration = {
        defaultVisibility: true,
        currentVisibility: false,
        labels: []
    };
    this.presenter.DOMElements.viewContainer = $("<div>" +
                                                    "<div class='animation-label' style='visibility: visible'>1</div>" +
                                                    "<div class='animation-label' style='visibility: visible'>2</div>" +
                                                "</div>");
    this.presenter.configuration.animationState = 2; // STOPPED
    this.presenter.configuration.currentFrame = 0;
};

ShowHideMethodsTests.prototype.testShowMethod = function() {
    // Given
    var expectedVisibility = true;

    // When
    this.presenter.show();

    // Then
    assertEquals("", expectedVisibility, this.presenter.configuration.currentVisibility);
    assertTrue("", this.presenter.configuration.defaultVisibility);
};

ShowHideMethodsTests.prototype.testHideMethod = function() {
    // Given
    var expectedVisibility = false;

    // When
    this.presenter.hide();

    // Then
    assertEquals("", expectedVisibility, this.presenter.configuration.currentVisibility);
    assertTrue("defaultVisibility should NOT change !", this.presenter.configuration.defaultVisibility);
};

ShowHideMethodsTests.prototype.testLabelsAreHidingProperly = function() {
    // Given
    var expectedVisibilityOfLabels = 'hidden';

    this.presenter.configuration.labels = [
        {
            content: [
                {
                    text: '1'
                },
                {
                    text: '2'
                }
            ],
            count: 2
        }
    ];

    // When
    this.presenter.hide();
    var labels = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

    // Then
    assertEquals("", expectedVisibilityOfLabels, $(labels[0]).css('visibility'));
    assertEquals("", expectedVisibilityOfLabels, $(labels[1]).css('visibility'));
};

ShowHideMethodsTests.prototype.testLabelsAreShowingProperly = function() {
    // Given
    var expectedVisibilityOfLabels = 'visible';
    var labelsBefore = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

    $.each(labelsBefore, function(){
        $(this).css('visibility', 'hidden');
    });

    this.presenter.configuration.labels = {
        content: [
            {
                text: '1',
                frames: [1, 2]
            },
            {
                text: '2',
                frames: [1, 2]
            }
        ],
        count: 2
    };

    // When
    this.presenter.show();
    var labelsAfter = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

    // Then
    assertEquals("", expectedVisibilityOfLabels, $(labelsAfter[0]).css('visibility'));
    assertEquals("", expectedVisibilityOfLabels, $(labelsAfter[1]).css('visibility'));
};
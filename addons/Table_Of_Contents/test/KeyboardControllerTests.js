TestCase("[Table Of Contents] Keyboard controller tests - default display type", {
    setUp : function() {
        this.presenter = AddonTable_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Table_of_Contents",
            displayType: this.presenter.DISPAY_TYPES.DEFAULT,
            hiddenPages: [''],
            isValid: true,
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);

        this.presenter.pagination = {
            pages: [[0, 1], [2]],
            size: 1
        };

        this.title = "Table of Contents";
        this.page1Name = "page1";
        this.page2Name = "page2";
        this.page3Name = "page3";
        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateToCView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateToCView: function () {
        let $tableOfContents = $(`<div></div>`);
        $tableOfContents.addClass("addon_Table_Of_Contents");

        $tableOfContents.append(this.generateToCViewTitle());
        $tableOfContents.append(this.generateToCViewList());
        $tableOfContents.append(this.generateToCViewPagination());

        return $tableOfContents;
    },

    generateToCViewTitle: function () {
        this.$title = $(`<div></div>`);
        this.$title.addClass(this.presenter.CSS_CLASSES.TITLE);
        this.$title.text(this.title);

        return this.$title;
    },

    generateToCViewPagination: function () {
        let $pagination = $(`<div></div>`);
        $pagination.addClass(this.presenter.CSS_CLASSES.PAGINATION);

        this.$paginationElement1 = $(`<a></a>`);
        this.$paginationElement1.addClass(this.presenter.CSS_CLASSES.SELECTED);
        this.$paginationElement1.text("1");
        this.$paginationElement1.appendTo($pagination);

        this.$paginationElement2 = $(`<a></a>`);
        this.$paginationElement2.text("2");
        this.$paginationElement2.appendTo($pagination);

        return $pagination;
    },

    generateToCViewList: function () {
        let $list = $(`<div></div>`);
        $list.addClass(this.presenter.CSS_CLASSES.LIST);

        let $orderedListElement = $(`<ol start="1"></ol>`);
        $orderedListElement.append(this.generateToCDisplayedListItem());
        $orderedListElement.append(this.generateToCCurrentDisplayedListItem());
        $orderedListElement.append(this.generateToCNotDisplayedListItem());
        $orderedListElement.appendTo($list);

        return $list;
    },

    generateToCDisplayedListItem : function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'list-item',});

        this.$displayedHyperLink = $(`<a></a>`);
        this.$displayedHyperLink.addClass('');
        this.$displayedHyperLink.attr('href', '#');
        this.$displayedHyperLink.text(this.page1Name);
        this.$displayedHyperLink.appendTo($listItem);

        return $listItem;
    },

    generateToCCurrentDisplayedListItem: function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'list-item',});

        this.$displayedCurrentPageHyperLink = $(`<a></a>`);
        this.$displayedCurrentPageHyperLink.addClass("current-page");
        this.$displayedCurrentPageHyperLink.attr('href', '#');
        this.$displayedCurrentPageHyperLink.text(this.page2Name);
        this.$displayedCurrentPageHyperLink.appendTo($listItem);

        return $listItem;
    },

    generateToCNotDisplayedListItem: function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'none',});

        let $hyperLink = $(`<a></a>`);
        $hyperLink.addClass('');
        $hyperLink.attr('href', '#');
        $hyperLink.text(this.page3Name);
        $hyperLink.appendTo($listItem);

        return $listItem;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForTitle: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForTitle(this.title, this.getFirstReadText());
    },

    validateTTSForSelectedPaginationHyperLink: function () {
        assertTrue(this.tts.speak.calledOnce);
        this.validateTTSForPaginationHyperLink(
            1, 2, this.getFirstReadText(), true
        );
    },

    validateTTSForNotSelectedPaginationHyperLink: function () {
        assertTrue(this.tts.speak.calledOnce);
        this.validateTTSForPaginationHyperLink(
            2, 2, this.getFirstReadText(), false
        );
    },

    validateTTSForPaginationHyperLink: function(currentPageId, pagesAmount, result, isSelected) {
        var expectedVoiceObjectId = 0;
        const expectedVoiceObjectsAmount = isSelected ? 3 : 2;
        assertEquals(expectedVoiceObjectsAmount, result.length);

        const expectedPrefix1 = "Pagination";
        const prefix1 = result[expectedVoiceObjectId]["text"];
        assertEquals(expectedPrefix1, prefix1);

        if (isSelected) {
            expectedVoiceObjectId++;
            const expectedPrefix2 = "Selected";
            const prefix2 = result[expectedVoiceObjectId]["text"];
            assertEquals(expectedPrefix2, prefix2);
        }

        expectedVoiceObjectId++;
        const expectedGoToPageFragment = `${currentPageId} out of ${pagesAmount}`
        const title = result[expectedVoiceObjectId]["text"];
        assertEquals(expectedGoToPageFragment, title);
    },

    activateKeyboardNavigation: function() {
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(
            this.presenter.getElementsForKeyboardNavigation()
        );
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.presenter.isFirstEnter = false;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForTTS());
    },

    getExpectedDisplayedHiperLinkTTS: function() {
        return `${this.presenter.speechTexts.GoToPage} ${this.page1Name}`;
    },

    getExpectedNotSelectedPaginationHyperLinkTTS: function() {
        return `${this.presenter.speechTexts.Pagination}. 2 ${this.presenter.speechTexts.OutOf} 2`;
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark first hyper link' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test given view when entering for the first time by TTS should mark title' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when entering by TTS should call tts.read' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    // Title tests

    'test addon when entering on title by TTS should mark title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate enter on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Hiper link tests

    'test addon when entering on hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test addon when entering on hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test addon when entering on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedDisplayedHiperLinkTTS(), this.getFirstReadText());
    },

    'test addon when activate enter on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedDisplayedHiperLinkTTS(), this.getFirstReadText());
    },

    // Not displayed hiper link

    'test addon when entering on not displayed hiper link by keyboard navigation should switch to next element and mark this element' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateTabEvent(this.presenter);

        assertEquals(3, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement1));
    },

    'test addon when entering on not displayed hiper link by TTS should switch to next element and mark this element' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertEquals(4, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement1));
    },

    'test addon when entering on not displayed hiper link by TTS should switch to next element and call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertEquals(4, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        this.validateTTSForSelectedPaginationHyperLink();
    },

    // Pagination selected hiper link

    'test addon when entering on selected pagination hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement1));
    },

    'test addon when entering on selected pagination hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 3);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement1));
    },

    'test addon when entering on selected pagination hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 3);

        activateTabEvent(this.presenter);

        this.validateTTSForSelectedPaginationHyperLink();
    },

    'test addon when activate enter on selected pagination hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 4);

        activateEnterEvent(this.presenter);

        this.validateTTSForSelectedPaginationHyperLink();
    },

    // Pagination not selected hiper link

    'test addon when entering on not selected pagination hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 3);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement2));
    },

    'test addon when entering on not selected pagination hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 4);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$paginationElement2));
    },

    'test addon when entering on not selected pagination hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 4);

        activateTabEvent(this.presenter);

        this.validateTTSForNotSelectedPaginationHyperLink();
    },

    'test addon when activate enter on not selected pagination hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 5);

        activateEnterEvent(this.presenter);

        this.validateTTSForNotSelectedPaginationHyperLink();
    },
});

TestCase("[Table Of Contents] Keyboard controller tests - list display type", {
    setUp : function() {
        this.presenter = AddonTable_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Table_of_Contents",
            displayType: this.presenter.DISPAY_TYPES.LIST,
            hiddenPages: [''],
            isValid: true,
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);

        this.title = "Table of Contents";
        this.page1Name = "page1";
        this.page2Name = "page2";
        this.page3Name = "page3";
        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateToCView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateToCView: function () {
        let $tableOfContents = $(`<div></div>`);
        $tableOfContents.addClass("addon_Table_Of_Contents");

        $tableOfContents.append(this.generateToCViewTitle());
        $tableOfContents.append(this.generateToCViewList());
        $tableOfContents.append(this.generateToCViewPagination());

        return $tableOfContents;
    },

    generateToCViewTitle: function () {
        this.$title = $(`<div></div>`);
        this.$title.addClass(this.presenter.CSS_CLASSES.TITLE);
        this.$title.text(this.title);

        return this.$title;
    },

    generateToCViewPagination: function () {
        let $pagination = $(`<div></div>`);
        $pagination.addClass(this.presenter.CSS_CLASSES.PAGINATION);

        return $pagination;
    },

    generateToCViewList: function () {
        let $list = $(`<div></div>`);
        $list.addClass(this.presenter.CSS_CLASSES.LIST);

        let $orderedListElement = $(`<ol start="1"></ol>`);
        $orderedListElement.append(this.generateToCDisplayedListItem());
        $orderedListElement.append(this.generateToCCurrentDisplayedListItem());
        $orderedListElement.append(this.generateToCNotDisplayedListItem());
        $orderedListElement.appendTo($list);

        return $list;
    },

    generateToCDisplayedListItem : function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'list-item',});

        this.$displayedHyperLink = $(`<a></a>`);
        this.$displayedHyperLink.addClass('');
        this.$displayedHyperLink.attr('href', '#');
        this.$displayedHyperLink.text(this.page1Name);
        this.$displayedHyperLink.appendTo($listItem);

        return $listItem;
    },

    generateToCCurrentDisplayedListItem: function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'list-item',});

        this.$displayedCurrentPageHyperLink = $(`<a></a>`);
        this.$displayedCurrentPageHyperLink.addClass("current-page");
        this.$displayedCurrentPageHyperLink.attr('href', '#');
        this.$displayedCurrentPageHyperLink.text(this.page2Name);
        this.$displayedCurrentPageHyperLink.appendTo($listItem);

        return $listItem;
    },

    generateToCNotDisplayedListItem: function() {
        let $listItem = $(`<li></li>`);
        $listItem.css({'display': 'none',});

        let $hyperLink = $(`<a></a>`);
        $hyperLink.addClass('');
        $hyperLink.attr('href', '#');
        $hyperLink.text(this.page3Name);
        $hyperLink.appendTo($listItem);

        return $listItem;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForTitle: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForTitle(this.title, this.getFirstReadText());
    },

    activateKeyboardNavigation: function() {
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.presenter.isFirstEnter = false;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForTTS());
    },

    getExpectedDisplayedHiperLinkTTS: function() {
        return `${this.presenter.speechTexts.GoToPage} ${this.page1Name}`;
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark first hyper link' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test given view when entering for the first time by TTS should mark title' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when entering by TTS should call tts.read' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    // Title tests

    'test addon when entering on title by TTS should mark title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate enter on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Hiper link tests

    'test addon when entering on hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test addon when entering on hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test addon when entering on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedDisplayedHiperLinkTTS(), this.getFirstReadText());
    },

    'test addon when activate enter on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedDisplayedHiperLinkTTS(), this.getFirstReadText());
    },

    // Not displayed hiper link

    'test addon when entering on not displayed hiper link by keyboard navigation should switch to next element and mark this element' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertEquals(0, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$displayedHyperLink));
    },

    'test addon when entering on not displayed hiper link by TTS should switch to next element and mark this element' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertEquals(0, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on not displayed hiper link by TTS should switch to next element and call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 2);

        activateTabEvent(this.presenter);

        assertEquals(0, this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex);
        this.validateTTSForTitle();
    },
});

TestCase("[Table Of Contents] Keyboard controller tests - icons list display type", {
    setUp : function() {
        this.presenter = AddonTable_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Table_of_Contents",
            displayType: this.presenter.DISPAY_TYPES.ICONS_LIST,
            hiddenPages: [''],
            isValid: true,
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);

        this.title = "Table of Contents";
        this.page1Name = "page1";
        this.page2Name = "page2";
        this.page3Name = "page3";
        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateToCView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateToCView: function () {
        let $tableOfContents = $(`<div></div>`);
        $tableOfContents.addClass("addon_Table_Of_Contents");

        $tableOfContents.append(this.generateToCViewTitle());
        $tableOfContents.append(this.generateToCViewList());
        $tableOfContents.append(this.generateToCViewPagination());
        $tableOfContents.append(this.generateToCViewIconsList());

        return $tableOfContents;
    },

    generateToCViewTitle: function () {
        this.$title = $(`<div></div>`);
        this.$title.addClass(this.presenter.CSS_CLASSES.TITLE);
        this.$title.text(this.title);

        return this.$title;
    },

    generateToCViewList: function () {
        let $list = $(`<div></div>`);
        $list.addClass(this.presenter.CSS_CLASSES.LIST);

        let $orderedListElement = $(`<ol></ol>`);
        $orderedListElement.appendTo($list);

        return $list;
    },

    generateToCViewPagination: function () {
        let $pagination = $(`<div></div>`);
        $pagination.addClass(this.presenter.CSS_CLASSES.PAGINATION);

        return $pagination;
    },

    generateToCViewIconsList: function () {
        let $iconsList = $(`<div></div>`);
        $iconsList.addClass(this.presenter.CSS_CLASSES.ICONS_LIST);

        this.$icon1HyperLink = this.generateImageContainer(this.page1Name, 1);
        this.$icon1HyperLink.appendTo($iconsList);

        this.$icon2HyperLink = this.generateImageContainer(this.page2Name, 2);
        this.$icon2HyperLink.appendTo($iconsList);

        this.$icon3HyperLink = this.generateImageContainer(this.page3Name, 3);
        this.$icon3HyperLink.appendTo($iconsList);

        return $iconsList;
    },

    generateImageContainer(iconText, pageId) {
        var $imageContainer = $(`<a></a>`);
        $imageContainer.addClass(this.presenter.CSS_CLASSES.IMAGE_CONTAINER);
        $imageContainer.attr(this.presenter.ATTRIBUTES.DATA_PAGE_NUMBER, pageId);

        var $icon = $(document.createElement('img'));
        $icon.addClass(this.presenter.CSS_CLASSES.IMAGE_ELEMENT);
        $icon.attr('src', '');
        $icon.appendTo($imageContainer);

        var $iconText = $(`<div></div>`);
        $iconText.addClass(this.presenter.CSS_CLASSES.IMAGE_ELEMENT);
        $iconText.text(iconText);
        $iconText.appendTo($imageContainer);

        return $imageContainer;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForTitle: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForTitle(this.title, this.getFirstReadText());
    },

    activateKeyboardNavigation: function() {
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.presenter.isFirstEnter = false;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForTTS());
    },

    getExpectedIconTTS: function() {
        return `${this.presenter.speechTexts.GoToPage} ${this.page1Name}`;
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark first hyper link' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test given view when entering for the first time by TTS should mark title' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when entering by TTS should call tts.read' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    // Title tests

    'test addon when entering on title by TTS should mark title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate enter on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Icon tests

    'test addon when entering on hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test addon when entering on hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test addon when entering on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedIconTTS(), this.getFirstReadText());
    },

    'test addon when activate enter on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedIconTTS(), this.getFirstReadText());
    },
});

TestCase("[Table Of Contents] Keyboard controller tests - icons display type", {
    setUp : function() {
        this.presenter = AddonTable_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Table_of_Contents",
            displayType: this.presenter.DISPAY_TYPES.ICONS,
            hiddenPages: [''],
            isValid: true,
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);

        this.title = "Table of Contents";
        this.page1Name = "page1";
        this.page2Name = "page2";
        this.page3Name = "page3";
        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateToCView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateToCView: function () {
        let $tableOfContents = $(`<div></div>`);
        $tableOfContents.addClass("addon_Table_Of_Contents");

        $tableOfContents.append(this.generateToCViewTitle());
        $tableOfContents.append(this.generateToCViewList());
        $tableOfContents.append(this.generateToCViewPagination());
        $tableOfContents.append(this.generateToCViewIcons());

        return $tableOfContents;
    },

    generateToCViewTitle: function () {
        this.$title = $(`<div></div>`);
        this.$title.addClass(this.presenter.CSS_CLASSES.TITLE);
        this.$title.text(this.title);

        return this.$title;
    },

    generateToCViewList: function () {
        let $list = $(`<div></div>`);
        $list.addClass(this.presenter.CSS_CLASSES.LIST);

        let $orderedListElement = $(`<ol></ol>`);
        $orderedListElement.appendTo($list);

        return $list;
    },

    generateToCViewPagination: function () {
        let $pagination = $(`<div></div>`);
        $pagination.addClass(this.presenter.CSS_CLASSES.PAGINATION);

        return $pagination;
    },

    generateToCViewIcons: function () {
        let $iconsList = $(`<div></div>`);
        $iconsList.addClass(this.presenter.CSS_CLASSES.ICONS_LIST);

        this.$icon1HyperLink = this.generateImageContainer(this.page1Name, 1);
        this.$icon1HyperLink.appendTo($iconsList);

        this.$icon2HyperLink = this.generateImageContainer(this.page2Name, 2);
        this.$icon2HyperLink.appendTo($iconsList);

        this.$icon3HyperLink = this.generateImageContainer(this.page3Name, 3);
        this.$icon3HyperLink.appendTo($iconsList);

        return $iconsList;
    },

    generateImageContainer(iconText, pageId) {
        var $imageContainer = $(`<a></a>`);
        $imageContainer.addClass(this.presenter.CSS_CLASSES.IMAGE_CONTAINER);
        $imageContainer.attr(this.presenter.ATTRIBUTES.DATA_PAGE_NUMBER, pageId);

        var $icon = $(document.createElement('img'));
        $icon.addClass(this.presenter.CSS_CLASSES.IMAGE_ELEMENT);
        $icon.attr('src', '');
        $icon.appendTo($imageContainer);

        return $imageContainer;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForTitle: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForTitle(this.title, this.getFirstReadText());
    },

    activateKeyboardNavigation: function() {
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.presenter.isFirstEnter = false;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForTTS());
    },

    getExpectedIconTTS: function() {
        return `${this.presenter.speechTexts.GoToPageNumber} 1`;
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark first hyper link' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test given view when entering for the first time by TTS should mark title' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when entering by TTS should call tts.read' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    // Title tests

    'test addon when entering on title by TTS should mark title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate enter on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Icon tests

    'test addon when entering on hiper link by keyboard navigation should mark hiper link' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test addon when entering on hiper link by TTS should mark hiper link' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$icon1HyperLink));
    },

    'test addon when entering on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedIconTTS(), this.getFirstReadText());
    },

    'test addon when activate enter on hiper link by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
        assertEquals(this.getExpectedIconTTS(), this.getFirstReadText());
    },
});

TestCase("[Table Of Contents] Keyboard controller tests - comboList display type", {
    setUp : function() {
        this.presenter = AddonTable_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Table_of_Contents",
            displayType: this.presenter.DISPAY_TYPES.COMBO_LIST,
            hiddenPages: [''],
            isValid: true,
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            preventDefaultStub: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);

        this.title = "Table of Contents";
        this.page1Name = "page1";
        this.page2Name = "page2";
        this.page3Name = "page3";
        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateToCView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        this.presenter.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateToCView: function () {
        let $tableOfContents = $(`<div></div>`);
        $tableOfContents.addClass("addon_Table_Of_Contents");

        $tableOfContents.append(this.generateToCViewTitle());
        $tableOfContents.append(this.generateToCViewList());
        $tableOfContents.append(this.generateToCViewPagination());
        $tableOfContents.append(this.generateToCViewComboList());

        return $tableOfContents;
    },

    generateToCViewTitle: function () {
        this.$title = $(`<div></div>`);
        this.$title.addClass(this.presenter.CSS_CLASSES.TITLE);
        this.$title.text(this.title);

        return this.$title;
    },

    validateTTSForComboListOption1: function() {
        this.validateTTSForComboListForFirstReadText(1);
    },

    validateTTSForComboListOption2: function() {
        this.validateTTSForComboListForFirstReadText(2);
    },

    validateTTSForComboListOption3: function() {
        this.validateTTSForComboListForFirstReadText(3);
    },

    validateTTSForComboListForFirstReadText: function (optionId) {
        assertTrue(this.tts.speak.calledOnce);

        const result = this.getFirstReadText();
        this.validateTTSForComboList(optionId, result);
    },

    validateTTSForComboList: function (optionId, result) {
        assertEquals(2, result.length);

        var expectedPageName = "";
        switch (optionId) {
            case 1:
                expectedPageName = this.page1Name;
                break;
            case 2:
                expectedPageName = this.page2Name;
                break;
            case 3:
                expectedPageName = this.page3Name;
                break;
        }

        const expectedPrefix = this.presenter.speechTexts.PagesList;
        const prefix = result[0]["text"];
        assertEquals(expectedPrefix, prefix);

        const pageName = result[1]["text"];
        assertEquals(expectedPageName, pageName);
    },

    generateToCViewList: function () {
        let $list = $(`<div></div>`);
        $list.addClass(this.presenter.CSS_CLASSES.LIST);

        let $orderedListElement = $(`<ol></ol>`);
        $orderedListElement.appendTo($list);

        return $list;
    },

    generateToCViewPagination: function () {
        let $pagination = $(`<div></div>`);
        $pagination.addClass(this.presenter.CSS_CLASSES.PAGINATION);

        return $pagination;
    },

    generateToCViewComboList: function () {
        this.$comboList = $(`<select></select>`);
        this.$comboList.addClass(this.presenter.CSS_CLASSES.COMBO_LIST);

        var $option1HyperLink = this.generateOption(this.page1Name, 1);
        $option1HyperLink.appendTo(this.$comboList);

        var $option2HyperLink = this.generateOption(this.page2Name, 2);
        $option2HyperLink.appendTo(this.$comboList);

        var $option3HyperLink = this.generateOption(this.page3Name, 3);
        $option3HyperLink.appendTo(this.$comboList);

        return this.$comboList;
    },

    generateOption(text) {
        var $option = $(`<option></option>`);
        $option.text(text);

        return $option;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    getSecondReadText: function() {
        // gets second call
        return this.tts.speak.args[1][0];
    },

    validateTTSForTitle: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForTitle(this.title, this.getFirstReadText());
    },

    activateKeyboardNavigation: function() {
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForKeyboardNavigation());
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.presenter.isFirstEnter = false;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;
        this.presenter.keyboardControllerObject.setElements(this.presenter.getElementsForTTS());
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark combo list' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test given view when entering for the first time by TTS should mark title' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when entering by TTS should call tts.read' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    // Title tests

    'test addon when entering on title by TTS should mark title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when entering on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, -1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate enter on title by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();

        activateEnterEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Entering by events on combo list tests

    'test addon when entering by tab event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by tab event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateTabEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when entering by right arrow event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateRightArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by right arrow event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateRightArrowEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when entering by down arrow event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateDownArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by down arrow event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateDownArrowEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when entering by shift+tab event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateShiftTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by shift+tab event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateShiftTabEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when entering by left arrow event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateLeftArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by left arrow event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateLeftArrowEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when entering by up arrow event on combo list by TTS should mark combo list' : function() {
        this.activateTTSWithoutReading();

        activateUpArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when entering by up arrow event on combo list by TTS should call tts.read with proper text form first option' : function() {
        this.activateTTSWithoutReading();

        activateUpArrowEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    // Tab, Shift+Tab, and Enter events on combo list tests

    'test addon when activate enter on combo list by keyboard navigation should prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate enter on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate enter on combo list by TTS should call tts.read with proper text from current selected option' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateEnterEvent(this.presenter);

        this.validateTTSForComboListOption1();
    },

    'test addon when activate tab on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateTabEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate tab on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateTabEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate tab on combo list by TTS should mark next element - title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when activate tab on combo list by TTS should call tts.read with proper text from next element - title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    'test addon when activate shift+tab on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateShiftTabEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate shift+tab on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateShiftTabEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate shift+tab on combo list by TTS should mark previous element - title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateShiftTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$title));
    },

    'test addon when activate shift+tab on combo list by TTS should call tts.read with proper text from previous element - title' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateShiftTabEvent(this.presenter);

        this.validateTTSForTitle();
    },

    // Arrows events on combo list tests

    'test addon when activate right arrow on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateRightArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate right arrow on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateRightArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate right arrow on not last combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateRightArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate right arrow on last combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateRightArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate right arrow on not last combo list by TTS should call tts.read with proper text from next option' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateRightArrowEvent(this.presenter);

        this.validateTTSForComboListOption2();
    },

    'test addon when activate right arrow on last combo list by TTS should not call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(this.tts.speak.calledOnce);
        activateRightArrowEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    'test addon when activate down arrow on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateDownArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate down arrow on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateDownArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate down arrow on not last combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateDownArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate down arrow on last combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateDownArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate down arrow on not last combo list option by TTS should call tts.read with proper text from next option' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateDownArrowEvent(this.presenter);

        this.validateTTSForComboListOption2();
    },

    'test addon when activate down arrow on last combo list option by TTS should not call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(this.tts.speak.calledOnce);
        activateDownArrowEvent(this.presenter);

        assertTrue(this.tts.speak.calledOnce);
    },

    'test addon when activate up arrow on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateUpArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate up arrow on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateUpArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate up arrow on not first combo list by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateUpArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate up arrow on first combo list by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateUpArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate up arrow on not first combo list by TTS should call tts.read with proper text from previous option' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(this.tts.speak.calledOnce);
        activateUpArrowEvent(this.presenter);

        const readText = this.getSecondReadText();
        this.validateTTSForComboList(2, readText);
    },

    'test addon when activate up arrow on first combo list by TTS should not call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateUpArrowEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test addon when activate left arrow on combo list by keyboard navigation should not prevent default event' : function() {
        this.activateKeyboardNavigation();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateLeftArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertFalse(this.stubs.preventDefaultStub.called);
    },

    'test addon when activate left arrow on combo list by TTS should prevent default event' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateLeftArrowEvent(this.presenter, this.stubs.preventDefaultStub);

        assertTrue(this.stubs.preventDefaultStub.calledOnce);
    },

    'test addon when activate left arrow on not first combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateLeftArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate left arrow on first combo list option by TTS should still mark combo list' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
        activateLeftArrowEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.$comboList));
    },

    'test addon when activate left arrow on not first combo list option by TTS should call tts.read with proper text from previous option' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
        this.presenter.keyboardControllerObject.switchOption(2);

        assertTrue(this.tts.speak.calledOnce);
        activateLeftArrowEvent(this.presenter);

        const readText = this.getSecondReadText();
        this.validateTTSForComboList(2, readText);
    },

    'test addon when activate left arrow on first combo list option by TTS should not call tts.read' : function() {
        this.activateTTSWithoutReading();
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);

        activateLeftArrowEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },
});

function activateEnterEvent(presenter, stub) {
    const keycode = 13;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateShiftTabEvent(presenter, stub) {
    const keycode = 9;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, true, event);
}

function activateTabEvent(presenter, stub) {
    const keycode = 9;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateRightArrowEvent(presenter, stub) {
    const keycode = 39;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateLeftArrowEvent(presenter, stub) {
    const keycode = 37;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateUpArrowEvent(presenter, stub) {
    const keycode = 38;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateDownArrowEvent(presenter, stub) {
    const keycode = 40;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function hasKeyboardNavigationActiveElementClass($element) {
    return $element.hasClass("keyboard_navigation_active_element");
}

function setSpeechTexts(presenter) {
    presenter.setSpeechTexts({
        Title: {Title: ""},
        GoToPage: {GoToPage: ""},
        GoToPageNumber: {GoToPageNumber: ""},
        PagesList: {PagesList: ""},
        Pagination: {Pagination: ""},
        OutOf: {OutOf: ""},
        Selected: {Selected: ""},
    });
}

function validateTTSForTitle(elementTitle, result) {
    assertEquals(2, result.length);

    const expectedPrefix = "Title";
    const prefix = result[0]["text"];
    assertEquals(expectedPrefix, prefix);

    const title = result[1]["text"];
    assertEquals(elementTitle, title);
}

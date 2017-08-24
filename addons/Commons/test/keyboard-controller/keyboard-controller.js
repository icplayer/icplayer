function getKeyboardController(elements, columns){
    return new KeyboardController(elements, columns);
}

function cloneObj(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function getObject() {
    return {
        'class': 'some_class',
        'selected': false,
        'addClass': function (cls) {
            this.class += ' ' + cls;
        },
        'removeClass': function (cls) {
            this.class = this.class.replace(' ' + cls, '');
        },
        'click': function () {
            this.selected = !this.selected;
        }
    }
}

function getElements(defaultObject, len) {
    var elements = [];
    for (var i=0; i<len; i++){
        elements.push(cloneObj(defaultObject))
    }
    return elements;
}

function countActiveElements(elements){
    var active_elements_count = 0;
    for (var i=0; i<elements.length; i++){
        var e = elements[i];
        if (e.class.indexOf('keyboard_navigation_active_element') > -1){
            active_elements_count++;
        }
    }
    return active_elements_count;
}

function countSelectedElements(elements){
    var selected_elements_count = 0;
    for (var i=0; i<elements.length; i++){
        var e = elements[i];
        if (e.selected){
            selected_elements_count++;
        }
    }
    return selected_elements_count;
}

function getTestData(cols, rows) {
    var elements = getElements(getObject(), rows*cols);
    var controller = getKeyboardController(elements, cols);
    return {
        'elements': elements,
        'controller': controller,
    };
}

TestCase("[Commons - Keyboard controller] Marking tests", {
    'test mark on Enter': function() {
        var data = getTestData(4,3);
        var elements = data.elements;
        var controller = data.controller;
        controller.handle(13);
        assertEquals('some_class keyboard_navigation_active_element', elements[0].class);
        assertEquals(1, countActiveElements(elements));
    },

    'test unmark on Escape': function() {
        var data = getTestData(4,3);
        var elements = data.elements;
        var controller = data.controller;
        assertEquals(0, countActiveElements(elements));
        controller.handle(13);
        assertEquals(1, countActiveElements(elements));
        controller.handle(27);
        assertEquals(0, countActiveElements(elements));
    },

    'test move sequence': function() {
        var data = getTestData(4,3);
        var elements = data.elements;
        var controller = data.controller;
        assertEquals(0, countActiveElements(elements));
        controller.handle(13);
        assertEquals(1, countActiveElements(elements));

        // move right
        controller.handle(39);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[1].class);

        // move down
        controller.handle(40);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[5].class);

        // move left
        controller.handle(37);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[4].class);

        // move up
        controller.handle(38);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[0].class);
    },

    'test corner moves': function() {
        var data = getTestData(4,3);
        var elements = data.elements;
        var controller = data.controller;
        assertEquals(0, countActiveElements(elements));
        controller.handle(13);
        assertEquals(1, countActiveElements(elements));

        // move left
        controller.handle(37);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[11].class);

        // move down
        controller.handle(40);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[3].class);

        // move right
        controller.handle(39);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[4].class);

        // move up twice
        controller.handle(38);
        controller.handle(38);
        assertEquals(1, countActiveElements(elements));
        assertEquals('some_class keyboard_navigation_active_element', elements[8].class);
    },

    'test select element': function() {
        var data = getTestData(4, 3);
        var elements = data.elements;
        var controller = data.controller;
        controller.handle(13);
        // move down
        controller.handle(40);
        assertEquals(1, countActiveElements(elements));
        assertEquals(0, countSelectedElements(elements));

        var expectedElement = elements[4];
        assertEquals('some_class keyboard_navigation_active_element', expectedElement.class);
        assertFalse(expectedElement.selected);

        // select element (space)
        controller.handle(32);
        assertTrue(expectedElement.selected);
        assertEquals(1, countSelectedElements(elements));

        // block selection
        controller.selectEnabled(false);

        // space
        controller.handle(32);
        assertTrue(expectedElement.selected);
        assertEquals(1, countSelectedElements(elements));

        // unblock selection
        controller.selectEnabled(true);

        // space
        controller.handle(32);
        assertFalse(expectedElement.selected);
        assertEquals(0, countSelectedElements(elements));
    }

});

TestCase("[Commons - Keyboard controller] set elements", {
    setUp: function () {
        this.startedElements = [{
            removeClass: sinon.spy(),
            addClass: sinon.spy()
        }];
        this.keyboardController = new KeyboardController(this.startedElements, 1);
    },

    'test set element will set all elements and will mark first': function () {
        var elements = [{
            removeClass: sinon.spy(),
            addClass: sinon.spy()
        }, {
            removeClass: sinon.spy(),
            addClass: sinon.spy()
        }];

        this.keyboardController.setElements(elements);

        assertTrue(this.startedElements[0].removeClass.calledOnce);
        assertTrue(elements[0].addClass.calledOnce);
    }
});
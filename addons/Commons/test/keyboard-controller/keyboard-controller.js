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

TestCase("[Commons - Keyboard controller] Marking tests", {
    setUp: function () {
        var columns = 4;
        var rows = 3;

        this.elements = getElements(getObject(), rows*columns);
        this.controller = new KeyboardController(this.elements, columns);

        this.handleFunction = this.controller.handle;

        this.controller.handle = function (keycode, isShiftDown) {
            var event = {
                which: keycode,
                preventDefault: sinon.stub()
            };
            this.mapping[keycode].call(this, event);
        };
    },

    tearDown: function () {
        this.controller.handle = this.handleFunction;
    },

    'test mark on Enter': function() {
        this.controller.handle(13);
        assertEquals('some_class keyboard_navigation_active_element', this.elements[0].class);
        assertEquals(1, countActiveElements(this.elements));
    },

    'test unmark on Escape': function() {
        assertEquals(0, countActiveElements(this.elements));
        this.controller.handle(13);
        assertEquals(1, countActiveElements(this.elements));
        this.controller.handle(27);
        assertEquals(0, countActiveElements(this.elements));
    },

    'test move sequence': function() {
        assertEquals(0, countActiveElements(this.elements));
        this.controller.handle(13);
        assertEquals(1, countActiveElements(this.elements));

        // move right
        this.controller.handle(39);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[1].class);

        // move down
        this.controller.handle(40);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[5].class);

        // move left
        this.controller.handle(37);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[4].class);

        // move up
        this.controller.handle(38);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[0].class);
    },

    'test corner moves': function() {
        assertEquals(0, countActiveElements(this.elements));
        this.controller.handle(13);
        assertEquals(1, countActiveElements(this.elements));

        // move left
        this.controller.handle(37);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[11].class);

        // move down
        this.controller.handle(40);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[3].class);

        // move right
        this.controller.handle(39);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[4].class);

        // move up twice
        this.controller.handle(38);
        this.controller.handle(38);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals('some_class keyboard_navigation_active_element', this.elements[8].class);
    },

    'test select element': function() {
        this.controller.handle(13);
        // move down
        this.controller.handle(40);
        assertEquals(1, countActiveElements(this.elements));
        assertEquals(0, countSelectedElements(this.elements));

        var expectedElement = this.elements[4];
        assertEquals('some_class keyboard_navigation_active_element', expectedElement.class);
        assertFalse(expectedElement.selected);

        // select element (space)
        this.controller.handle(32);
        assertTrue(expectedElement.selected);
        assertEquals(1, countSelectedElements(this.elements));

        // block selection
        this.controller.selectEnabled(false);

        // space
        this.controller.handle(32);
        assertTrue(expectedElement.selected);
        assertEquals(1, countSelectedElements(this.elements));

        // unblock selection
        this.controller.selectEnabled(true);

        // space
        this.controller.handle(32);
        assertFalse(expectedElement.selected);
        assertEquals(0, countSelectedElements(this.elements));
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

        this.keyboardController.keyboardNavigationActive = true;

        this.keyboardController.setElements(elements);

        assertTrue(this.startedElements[0].removeClass.calledOnce);
        assertTrue(elements[0].addClass.calledOnce);
    }
});
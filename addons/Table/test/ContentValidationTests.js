TestCase("[Table] Content validation", {
    setUp: function() {
        this.presenter = AddonTable_create();

        this.columns = 3;
        this.rows = 2;
    },

    'test empty content list': function() {
        var content = [{
            Row: "",
            Column: "",
            Content: ""
        }];

        var emptyContent = [
            [
                { content: "", rowSpan: 1, colSpan: 1 },
                { content: "", rowSpan: 1, colSpan: 1 },
                { content: "", rowSpan: 1, colSpan: 1 }
            ], [
                { content: "", rowSpan: 1, colSpan: 1 },
                { content: "", rowSpan: 1, colSpan: 1 },
                { content: "", rowSpan: 1, colSpan: 1 }
            ]
        ];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertTrue(validatedContent.isValid);
        assertEquals(emptyContent, validatedContent.content);
    },

    'test empty content list with more than one element': function() {
        var content = [{
            Row: "",
            Column: "",
            Content: ""
        }, {
            Row: "",
            Column: "",
            Content: ""
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_06', validatedContent.errorCode);
    },

    'test invalid row number': function() {
        var content = [{
            Row: "",
            Column: "2",
            Content: "content"
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_01', validatedContent.errorCode);
    },

    'test row number out of bounds': function() {
        var content = [{
            Row: "3",
            Column: "2",
            Content: "content"
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_03', validatedContent.errorCode);
    },

    'test invalid column number': function() {
        var content = [{
            Row: "1",
            Column: "",
            Content: "content"
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_02', validatedContent.errorCode);
    },

    'test column number out of bounds': function() {
        var content = [{
            Row: "2",
            Column: "5",
            Content: "content"
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_04', validatedContent.errorCode);
    },

    'test not empty content list': function() {
        var content = [{
            Row: "1",
            Column: "1",
            Content: "[1][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "1",
            Column: "3",
            Content: "[1][3]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "1",
            Content: "[2][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "2",
            Content: "[2][2]",
            "class" : "",
            "style" : ""
        }];

        var emptyContent = [
            [
                { content: "[1][1]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                { content: "", rowSpan: 1, colSpan: 1 },
                { content: "[1][3]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" }
            ], [
                { content: "[2][1]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                { content: "[2][2]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                { content: "", rowSpan: 1, colSpan: 1 }
            ]
        ];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertTrue(validatedContent.isValid);
        assertEquals(emptyContent, validatedContent.content);
    },

    'test duplicated cell definition': function() {
        var content = [{
            Row: "1",
            Column: "1",
            Content: "[1][1]"
        }, {
            Row: "1",
            Column: "3",
            Content: "[1][3]"
        }, {
            Row: "2",
            Column: "1",
            Content: "[2][1]"
        }, {
            Row: "2",
            Column: "2",
            Content: "[2][2]"
        }, {
            Row: "1",
            Column: "3",
            Content: "<a href='#'>link</a>"
        }];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertFalse(validatedContent.isValid);
        assertEquals('CO_05', validatedContent.errorCode);
    },

    'test content with cells that has col span': function() {
        var content = [{
            Row: "1",
            Column: "1,2",
            Content: "[1][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "1",
            Column: "3",
            Content: "[1][3]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "1",
            Content: "[2][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "2,3",
            Content: "[2][2]",
            "class" : "",
            "style" : ""
        }];

        var emptyContent = [
            [
                { content: "[1][1]", rowSpan: 1, colSpan: 2, "class" : "", "style" : "" },
                undefined,
                { content: "[1][3]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" }
            ], [
                { content: "[2][1]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                { content: "[2][2]", rowSpan: 1, colSpan: 2, "class" : "", "style" : "" },
                undefined
            ]
        ];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);
        assertTrue(validatedContent.isValid);
        assertEquals(emptyContent, validatedContent.content);
    },

    'test content with cells that has row span': function() {
        var content = [{
            Row: "1,2",
            Column: "1",
            Content: "[1][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "1,2",
            Column: "3",
            Content: "[1][3]",
            "class" : "",
            "style" : ""
        }, {
            Row: "1",
            Column: "2",
            Content: "[1][2]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "2",
            Content: "[2][2]",
            "class" : "",
            "style" : ""
        }];

        var emptyContent = [
            [
                { content: "[1][1]", rowSpan: 2, colSpan: 1, "class" : "", "style" : "" },
                { content: "[1][2]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                { content: "[1][3]", rowSpan: 2, colSpan: 1, "class" : "", "style" : "" }
            ], [
                undefined,
                { content: "[2][2]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" },
                undefined
            ]
        ];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertTrue(validatedContent.isValid);
        assertEquals(emptyContent, validatedContent.content);
    },

    'test content with cells that has both row and col span': function() {
        var content = [{
            Row: "1,2",
            Column: "1,2",
            Content: "[1][1]",
            "class" : "",
            "style" : ""
        }, {
            Row: "1",
            Column: "3",
            Content: "[1][3]",
            "class" : "",
            "style" : ""
        }, {
            Row: "2",
            Column: "3",
            Content: "[2][3]",
            "class" : "",
            "style" : ""
        }];

        var emptyContent = [
            [
                { content: "[1][1]", rowSpan: 2, colSpan: 2, "class" : "", "style" : "" },
                undefined,
                { content: "[1][3]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" }
            ], [
                undefined,
                undefined,
                { content: "[2][3]", rowSpan: 1, colSpan: 1, "class" : "", "style" : "" }
            ]
        ];

        var validatedContent = this.presenter.validateContent(content, this.rows, this.columns);

        assertTrue(validatedContent.isValid);
        assertEquals(emptyContent, validatedContent.content);
    }
});
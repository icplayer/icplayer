TestCase("[Commons - XSS Utils] sanitize method", {

    'test given html without script or inline js when sanitize is called then content remains the same': function() {
        var html = "<div>Hello World</div>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals(html, outputHTML);
    },

    'test given html with script when sanitize is called then script element will be removed': function() {
        var html = "<div>Hello World</div><script>alert('You have been hacked!!!')</script>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals("<div>Hello World</div>", outputHTML);
    },

    'test given html with inline js when sanitize is called then script element will be removed': function() {
        var html = "<div onload='xssAttack()'>Hello World</div>";

        var outputHTML = window.xssUtils.sanitize(html);

        assertEquals("<div>Hello World</div>", outputHTML);
    },
});
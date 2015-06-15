TestCase("[Commons - Watermark] Watermark options check", {
    'test options undefined': function() {
        var validatedOptions = Watermark.validateOptions(undefined);

        assertEquals(Watermark.defaultOptions, validatedOptions);
    },

    'test color invalid': function() {
        var options = {
            size: 100,
            opacity: 0.5,
            color: '#GGFFFF'
        };

        var validatedOptions = Watermark.validateOptions(options);

        assertEquals(Watermark.defaultOptions.color, validatedOptions.color);
        assertEquals(options.opacity, validatedOptions.opacity);
        assertEquals(options.size, validatedOptions.size);
    },

    'test opacity undefined': function() {
        var options = {
            size: 100,
            color: '#AAFFFF'
        };

        var validatedOptions = Watermark.validateOptions(options);

        assertEquals(Watermark.defaultOptions.opacity, validatedOptions.opacity);
        assertEquals(options.size, validatedOptions.size);
        assertEquals(options.color, validatedOptions.color);
    },

    'test size invalid': function() {
        var options = {
            size: -10,
            opacity: 0.5,
            color: '#BBFFFF'
        };

        var validatedOptions = Watermark.validateOptions(options);

        assertEquals(Watermark.defaultOptions.size, validatedOptions.size);
        assertEquals(options.opacity, validatedOptions.opacity);
        assertEquals(options.color, validatedOptions.color);
    }
});
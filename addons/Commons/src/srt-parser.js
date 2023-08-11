/**
 * @module commons
 */

(function (window) {
    /**
     * Parser that helps dealing with SRT Subtitles. Converts raw data into JS object.
     * Converts times from milliseconds to colon seperated string format and other way around.
     * Allows to crop the time values.
     */
    var SrtParser = {};

    /**
     * Parse SRT data to JS Array of Objects
     * @param raw - raw data
     * @param timeInMs - flag, if true then time is returned in milliseconds else stays colon separated
     * @returns parsed - Array of objects: {id, startTime, endTime, text}
     */
    SrtParser.parse = function SrtParser_parse (raw, timeInMs) {
        var data = raw.replace(/\r/g, '');
        var regex = /([0-9 ]+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g;
        data = data.split(regex);
        data.shift();

        var items = [];
        for (var i = 0; i < data.length; i += 4) {
            items.push({
                id: data[i].trim(),
                startTime: timeInMs ? SrtParser.timeColonSeparatedToMs(data[i + 1].trim()) : data[i + 1].trim(),
                endTime: timeInMs ? SrtParser.timeColonSeparatedToMs(data[i + 2].trim()) : data[i + 2].trim(),
                text: data[i + 3].trim()
            });
        }

        return items;
    };

    /**
     * Crop time for each subtitle in parsed data. Parsed data time format is already in milliseconds, so it does not require format change.
     * @param parsed - parsed data with time in ms
     * @param crop - value to crop the times
     * @returns [{}] - array of parsed objects with altered times
     */
    SrtParser.cropTimes = function SrtParser_cropTimes (parsed, cropValueInMs) {
        var result = [];
        for (var i = 0; i < parsed.length; i++) {
            var start = parsed[i].startTime - cropValueInMs;
            var end = parsed[i].endTime - cropValueInMs;
            if(end < 0) {
                continue;
            }

            if(start < 0) {
                start = 0;
            }

            result.push({
                id: parsed[i].id,
                startTime: start,
                endTime: end,
                text: parsed[i].text
            });
        }

        return result;
    };

    /**
     * Change time colon separated format (XX:XX:XX,XXX) to milliseconds value.
     * @param val - string colon separated format
     * @returns ms - numerical value of input time in milliseconds
     */
    SrtParser.timeColonSeparatedToMs = function SrtParser_timeColonSeparatedToMs (val) {
        var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
        var parts = regex.exec(val);

        if (parts === null) {
            return 0;
        }

        for (var i = 1; i < 5; i++) {
            parts[i] = parseInt(parts[i], 10);
            if (isNaN(parts[i])) parts[i] = 0;
        }

        // hours + minutes + seconds + ms
        return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4];
    };

    /**
     * Change milliseconds value to time colon separated format (XX:XX:XX,XXX).
     * @param val - numerical value of time in milliseconds
     * @returns time -  string colon separated format
     */
    SrtParser.msToTimeColonSeparated = function SrtParser_msToTimeColonSeparated (val) {
        val = parseInt(val, 10);
        if (isNaN(val)) {
            return 0;
        }

        var measures = [ 3600000, 60000, 1000 ];
        var time = [];

        for (var i in measures) {
            var res = (val / measures[i] >> 0).toString();

            if (res.length < 2) res = '0' + res;
            val %= measures[i];
            time.push(res);
        }

        var ms = val.toString();
        if (ms.length < 3) {
            for (i = 0; i <= 3 - ms.length; i++) ms = '0' + ms;
        }

        return time.join(':') + ',' + ms;
    };

    window.SrtParser = SrtParser;
})(window);





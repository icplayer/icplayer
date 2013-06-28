/**
 * jQuery-csv - jQuery CSV Parser
 * http://code.google.com/p/jquery-csv/
 *
 * (c) 2012 Evan Plaice
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function () {
    if (typeof($.csv2Array) == "undefined") {
        RegExp.escape = function (s) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        };
        (function ($) {
            $.csvDefaults = {separator:',', delimiter:'"', escaper:'"', skip:0, headerLine:1, dataLine:2};
            $.csvEntry2Array = function (csv, meta) {
                var meta = (meta !== undefined ? meta : {});
                var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                separator = RegExp.escape(separator);
                delimiter = RegExp.escape(delimiter);
                escaper = RegExp.escape(escaper);
                var reValid = /^\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*(?:X\s*(?:Y[^YZ]*(?:ZY[^YZ]*)*Y|[^XYZ\s]*(?:\s+[^XYZ\s]+)*)\s*)*$/;
                reValid = RegExp(reValid.source.replace(/X/g, separator));
                reValid = RegExp(reValid.source.replace(/Y/g, delimiter));
                reValid = RegExp(reValid.source.replace(/Z/g, escaper));
                var reValue = /(?!\s*$)\s*(?:Y([^YZ]*(?:ZY[^YZ]*)*)Y|([^XYZ\s]*(?:\s+[^XYZ\s]+)*))\s*(?:X|$)/g;
                reValue = RegExp(reValue.source.replace(/X/g, separator), 'g');
                reValue = RegExp(reValue.source.replace(/Y/g, delimiter), 'g');
                reValue = RegExp(reValue.source.replace(/Z/g, escaper), 'g');
                if (!reValid.test(csv)) {
                    return null;
                }
                var output = [];
                csv.replace(reValue, function (m0, m1, m2) {
                    if (m1 !== undefined) {
                        var reDelimiterUnescape = /ED/g;
                        reDelimiterUnescape = RegExp(reDelimiterUnescape.source.replace(/E/, escaper), 'g');
                        reDelimiterUnescape = RegExp(reDelimiterUnescape.source.replace(/D/, delimiter), 'g');
                        output.push(m1.replace(reDelimiterUnescape, delimiter));
                    } else if (m2 !== undefined) {
                        output.push(m2);
                    }
                    return'';
                });
                var reEmptyLast = /S\s*$/;
                reEmptyLast = RegExp(reEmptyLast.source.replace(/S/, separator));
                if (reEmptyLast.test(csv)) {
                    output.push('');
                }
                return output;
            };
            $.array2CSVEntry = function (array, meta) {
                var meta = (meta !== undefined ? meta : {});
                var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                var output = []
                for (i in array) {
                    output.push(array[i]);
                }
                return output;
            };
            $.csv2Array = function (csv, meta) {
                var meta = (meta !== undefined ? meta : {});
                var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                var skip = 'skip'in meta ? meta.skip : $.csvDefaults.skip;
                var output = [];
                var lines = csv.split(/\r\n|\r|\n/g);

                for (var i in lines) {
                    if (!lines.hasOwnProperty(i)) continue;
                    if (i < skip) continue;

                    var line = $.csvEntry2Array(lines[i], {delimiter:delimiter, separator:separator, escaper:escaper, });
                    output.push(line);
                }
                return output;
            };
            $.csv2Dictionary = function (csv, meta) {
                var meta = (meta !== undefined ? meta : {});
                var separator = 'separator'in meta ? meta.separator : $.csvDefaults.separator;
                var delimiter = 'delimiter'in meta ? meta.delimiter : $.csvDefaults.delimiter;
                var escaper = 'escaper'in meta ? meta.escaper : $.csvDefaults.escaper;
                var headerLine = 'headerLine'in meta ? meta.headerLine : $.csvDefaults.headerLine;
                var dataLine = 'dataLine'in meta ? meta.dataLine : $.csvDefaults.dataLine;
                var lines = csv.split(/\r\n|\r|\n/g);
                var headers = $.csvEntry2Array(lines[(headerLine - 1)]);
                var output = [];
                for (var i in lines) {
                    if (!lines.hasOwnProperty(i)) continue;
                    if (i < (dataLine - 1)) continue;

                    var line = $.csvEntry2Array(lines[i], {delimiter:delimiter, separator:separator, escaper:escaper});
                    var lineDict = {};
                    for (var j in headers) {
                        lineDict[headers[j]] = line[j];
                    }
                    output.push(lineDict);
                }
                return output;
            };
        })(jQuery);
    }
})();
/**
 * @module PlayerUtils
 */
(function (window) {
    /**
     Player utils
     @class PlayerUtils
     */

        // Expose utils to the global object
    window.PlayerUtils = function (playerObject) {

        if (playerObject.hasOwnProperty("getPlayerServices")) {
            this.player = playerObject;
            this.playerServices = playerObject.getPlayerServices();
            this.scoreService = this.playerServices.getScore();
			this.timeService = this.playerServices.getTimeService();
        }
    };

    /**
     Returns Presentation object
     @method getPresentation

     @return {Object} current presentation
     */
    window.PlayerUtils.prototype.getPresentation = function getPresentation() {
        if (this.hasOwnProperty("playerServices")) {
            return this.playerServices.getPresentation();
        }
        else {
            return undefined;
        }
    };

/**
     Returns Presentation object

     @param {Object} presentation current presentation object

     @method getPresentation

     @return {Object} returns current presentation score (min, max, raw and scaled), errors count and checks count
     */
    window.PlayerUtils.prototype.getPresentationScore = function(presentation) {
        return this.getPresentationScoreBase(presentation, false);
    };

/**
     Returns Presentation score object, including non reportable pages

     @param {Object} presentation current presentation object

     @method getPresentation

     @return {Object} returns current presentation score (min, max, raw and scaled), errors count, checks count and time,
     as well as the time spent on non reportable pages
     */
    window.PlayerUtils.prototype.getFullPresentationScore = function(presentation) {
        return this.getPresentationScoreBase(presentation, true);
    };

    window.PlayerUtils.prototype.getPresentationScoreBase = function(presentation, includeNonReportable) {
        if (this.hasOwnProperty('scoreService')) {
            var sumOfScore = 0.0, sumOfErrors = 0, sumOfChecks = 0,
                sumOfMaxScore = 0.0,
                sumOfScaledScore = 0.0,
                sumOfMistakes = 0,
                sumOfWeights = 0,
                pageScaledScore = 0,
                reportableCount = 0,
                count = 0, i, page, score,
                paginatedResults = [];

            for (i = 0; i < presentation.getPageCount(); i++) {
                page = presentation.getPage(i);

                if (page.isReportable()) {
                    score = this.scoreService.getPageScoreWithoutOpenActivitiesById(page.getId());

                    if (score['maxScore']) {
                        pageScaledScore = score['score'] / score['maxScore'];
                    } else {
                        pageScaledScore = page.isVisited() ? 1 : 0;
                    }

                    var _weight = page.getPageWeight();
                    var weight =  !_weight && _weight !== 0 ? 1 : _weight;
                    sumOfScaledScore += pageScaledScore * weight;
                    sumOfScore += score.score;
                    sumOfErrors += score.errorCount;
                    sumOfChecks += score.checkCount;
                    sumOfMaxScore += score.maxScore;
                    sumOfMistakes += score.mistakeCount;
                    sumOfWeights += weight;

                    paginatedResults[count] = {
                        "page_number": (i + 1),
                        "page_name": page.getName(),
                        "page_id": page.getId(),
                        "score": Math.round(pageScaledScore * 100) / 100,
                        "absolute_score": score['score'],
                        "max_score": score['maxScore'] ? score['maxScore'] : page.getModulesMaxScore(),
                        "errors_count": score['errorCount'] ? score['errorCount'] : 0,
                        "checks_count": score['checkCount'] ? score['checkCount'] : 0,
                        "mistake_count": score['mistakeCount'] ? score['mistakeCount'] : 0,
                        "time": score['time'] ? parseInt(score['time'], 10) : 0
                    };
                    if (includeNonReportable) {
                        paginatedResults[count]["reportable"] = true;
                    }
                    count += 1;
                    reportableCount += 1;
                } else if (includeNonReportable) {
                    var pageTime = this.timeService.getPageTimeById(page.getId());
                    paginatedResults[count] = {
                        "page_number": (i + 1),
                        "page_name": page.getName(),
                        "page_id": page.getId(),
                        "score": 0.0,
                        "absolute_score": 0,
                        "max_score": 0,
                        "errors_count": 0,
                        "checks_count": 0,
                        "mistake_count": 0,
                        "time": pageTime ? parseInt(pageTime, 10) : 0,
                        "reportable": false
                    };
                    count += 1;
                }
            }

            var scaledScore = 0;
            var floatScore = 0;
            if (count > 0) {
                if (sumOfWeights) {
                    scaledScore = Math.round((sumOfScaledScore / sumOfWeights) * 100) / 100;
                    floatScore = sumOfScaledScore / sumOfWeights;
                } else {
                    scaledScore = 1;
                    floatScore = 1;
                }
            }

            totalTime = parseInt(this.timeService.getTotalTime(), 10);

            return {
                minScore: 0,
                maxScore: reportableCount,
                rawScore: sumOfScaledScore,
                floatScore: floatScore,
                scaledScore: scaledScore,
                errorsCount: sumOfErrors,
                checksCount: sumOfChecks,
                mistakeCount: sumOfMistakes,
                paginatedResult: paginatedResults,
                totalTime: totalTime
            };
        }
    };

})(window);

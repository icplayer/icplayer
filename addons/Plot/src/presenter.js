function AddonPlot_create(){
    function Plot() {
        this.VERSION = '1.1.13';
        this.STATE_CORRECT = 1;
        this.STATE_INCORRECT = 0;
        this.STATE_NOT_ACTIVITY = '';
        this.STATE_NULL = 0;
        this.STATE_SELECT_POINT = 1;
        this.STATE_DESELECT_POINT = 0;
        this.INFINITY_NEGATIVE_VALUE = -2147483647;
        this.INFINITY_POSITIVE_VALUE = 2147483647;
        this.ASYMPTOTE_MINIMUM_TRIAL = 3;
        this.TYPE_X_TO_Y = 1;
        this.TYPE_Y_TO_X = 2;
        this.asymptoteMinimumDY = 5;
        this.interactive = true;
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.zoomStep = 0.1;
        this.expressions = [];
        this.points = [];
        this.svg = null;
        this.stepX = 0;
        this.stepY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.width = 0;
        this.height = 0;
        this.gridStepX = 1;
        this.gridStepY = 1;
        this.grid = true;
        this.lastOffsetX = 0;
        this.lastOffsetY = 0;
        this.arrowheadSize = 6;
        this.axisValues = true;
        this.svgDoc = null;
        this.uiEnabled = true;
        this.initXMin = this.xMin;
        this.initXMax = this.xMax;
        this.initYMin = this.yMin;
        this.initYMax = this.yMax;
        this.pointActiveArea = 15;
        this.pointRadius = 3;
        this.pointOutlineRadius = 7;
        this.selectedPoints = [];
        this.xAxisDescription = 'x';
        this.yAxisDescription = 'y';
        this.xAxisVisible = true;
        this.yAxisVisible = true;
        this.xAxisCyclicValues = [];
        this.xAxisCustomValues = [];
        this.yAxisCyclicValues = [];
        this.yAxisCustomValues = [];
        this.maxSelectedPoints = 0;
        this.stateChanged = function(){};
        this.convertValueToDisplay = function(val){ return val; };
        this.isActivity = true;
        this.freePoints = false;
        this.precision = {x: 100, y:100};

        this.setScale = function () {
            this.svgDoc.find('.scale').attr('transform', 'scale(1, -1)');
        };
        this.setStep = function () {
            this.stepX = this.width/(Math.max(this.xMin, this.xMax) - Math.min(this.xMin, this.xMax));
            this.stepY = this.height/(Math.max(this.yMin, this.yMax) - Math.min(this.yMin, this.yMax));
        };
        this.translate = function() {
            this.offsetX = this.xMin*this.stepX*(-1);
            this.offsetY = this.yMax*this.stepY*(-1);
            this.svgDoc.find('.translate').attr('transform', 'translate('+this.offsetX+', '+this.offsetY+')');
        };
        this.draw = function() {
            this.clearCanvas();
            if(this.grid) {
                this.drawGrid();
            }
            this.drawAxis();
            this.drawPlots();
            if(this.points.length > 0 || this.freePoints) {
                this.drawPoints();
            }
            this.enableUI(this.uiEnabled);
        };
        this.clearCanvas = function() {
            this.svgDoc.find('.drawings').children().remove();
            this.svgDoc.find('.grid').children().remove();
            this.svgDoc.find('.axis').children().remove();
            this.svgDoc.find('.points').children().remove();
            this.svgDoc.find('.pointsAreas').children().remove();
            this.svgDoc.find('.drawingsAreas').children().remove();
        }
        this.drawXAxis = function() {
            var path = this.svg.createPath();
            this.svg.line(this.svgDoc.find('.axis'), -this.offsetX, 0, this.width-this.offsetX, 0);
            path.move(this.width - this.offsetX, 0).
            line(this.width - this.offsetX - this.arrowheadSize, this.arrowheadSize/2).
            line(this.width - this.offsetX - this.arrowheadSize, -this.arrowheadSize/2).
            line(this.width - this.offsetX, 0);
            this.svg.text(this.svgDoc.find('.axis'), this.width-this.offsetX-3, 13, this.xAxisDescription, {
                'class':'axisText axisXText',
                transform:'scale(1,-1)'
            });
            this.svg.path(this.svgDoc.find('.axis'), path, {
                'class':'axisArrows'
            });
        };
        this.drawYAxis = function() {
            var path = this.svg.createPath();
            this.svg.line(this.svgDoc.find('.axis'), 0, -this.offsetY, 0, -this.height-this.offsetY);
            path.move(0, -this.offsetY).
            line(this.arrowheadSize/2, -this.offsetY - this.arrowheadSize).
            line(-this.arrowheadSize/2, -this.offsetY - this.arrowheadSize).
            line(0, -this.offsetY);
            this.svg.text(this.svgDoc.find('.axis'), 7, this.offsetY+10, this.yAxisDescription, {
                'class':'axisText axisYText',
                transform:'scale(1,-1)'
            });
            this.svg.path(this.svgDoc.find('.axis'), path, {
                'class':'axisArrows'
            });
        };
        this.drawAxis0Point = function() {
            this.svg.text(this.svgDoc.find('.axis'), 3, 13, '0', {
                'class':'axisText',
                transform:'scale(1,-1)'
            });
        };
        this.drawXTick = function(x) {
            if(x < this.width - this.offsetX - this.arrowheadSize) {
                this.svg.line(this.svgDoc.find('.axis'), x, -3, x, 3);
            }
        };
        this.drawYTick = function(y) {
            if(y < -this.offsetY - this.arrowheadSize) {
                this.svg.line(this.svgDoc.find('.axis'), -3, y, 3, y);
            }
        };
        this.drawXTickValue = function(x, coords) {
            if(x < this.width - this.offsetX - 15) {
                if(this.xAxisVisible && this.yAxisVisible && coords.x == 0) {
                    return;
                } else {
                    this.svg.text(this.svgDoc.find('.axis'), x, 10, this.convertValueToDisplay(coords.x.toString()), {
                        'class':'axisText axisThicksTextX',
                        transform:'scale(1,-1)'
                    });
                }
            }
        };
        this.drawYTickValue = function(y, coords) {
            if(this.xAxisVisible && this.yAxisVisible && coords.y == 0) {
            ;
            } else {
                this.svg.text(this.svgDoc.find('.axis'), 7, y, this.convertValueToDisplay(coords.y.toString()), {
                    'class':'axisText axisThicksTextY',
                    transform:'scale(1,-1)'
                });
            }
        };
        this.checkAndDrawXTickValue = function(x, dx, cx, tx) {
            var currentTick;
            var coords = this.px2coords(cx, 0);
            //check cyclic values
            if(this.xAxisCyclicValues.length > 0) {
                currentTick = Math.round(x/dx);
                $.each(this.xAxisCyclicValues, function(k, v) {
                    if(currentTick%v == 0) {
                        plot.drawXTickValue(tx, coords);
                        return;
                    }
                })
            } else if(this.xAxisCustomValues.length == 0) {
                this.drawXTickValue(tx, coords);
            }
        };
        this.drawCustomXTicks = function() {
            $.each(this.xAxisCustomValues, function(idx, val) {
                p = plot.coords2px(val, 0);
                plot.drawXTick(p.x);
                plot.drawXTickValue(p.x, {x:val, y:0});
            });
        };
        this.drawXTicks = function() {
            var x, sp;
            var dx = this.gridStepX*this.stepX;
            var modX = this.offsetX%(dx);
            //get starting point of viewport
            sp = this.offsetX < 0 ? -this.offsetX + modX: 0
            //above 0
            for(x = sp; x <= this.width - this.offsetX; x += dx) {
                this.drawXTick(x);
                this.checkAndDrawXTickValue(x, dx, x+this.offsetX, x);
            }
            //below 0
            for(x = sp; x >= -this.offsetX - modX; x-= dx) {
                this.drawXTick(x);
                this.checkAndDrawXTickValue(x, dx, x+this.offsetX, x);
            }
            this.drawCustomXTicks();
        };
        this.checkAndDrawYTickValue = function(y, dy, cy, ty) {
            coords = this.px2coords(0, cy);
            //check cyclic values
            if(this.yAxisCyclicValues.length > 0) {
                currentTick = Math.round(y/dy);
                $.each(this.yAxisCyclicValues, function(k, v) {
                    if(currentTick%v == 0) {
                        plot.drawYTickValue(ty, coords);
                        return;
                    }
                })
            } else if(this.yAxisCustomValues.length == 0) {
                this.drawYTickValue(ty, coords);
            }
        };
        this.drawCustomYTicks = function() {
            var p;
            $.each(this.yAxisCustomValues, function(idx, val){
                p = plot.coords2px(0, val);
                plot.drawYTick(p.y);
                plot.drawYTickValue(-p.y, {
                    x:0,
                    y:val
                });
            });
        };
        this.drawYTicks = function() {
            var y;
            var dy = this.gridStepY*this.stepY;
            var modY = this.offsetY%(dy);
            sp = Math.abs(this.offsetY) < this.height ? 0 : Math.abs(this.offsetY) - this.height - (Math.abs(this.offsetY) - this.height)%dy;
            //above 0
            for(y = sp; y <= sp+this.height+dy; y += dy) {
                this.drawYTick(y);
                this.checkAndDrawYTickValue(y, dy, -y-this.offsetY, -y);
            }
            //below 0
            sp = this.offsetY > 0 ? this.offsetY - modY : 0;
            for(y = sp; y < this.offsetY + this.height; y += dy) {
                this.drawYTick(-y);
                this.checkAndDrawYTickValue(y, dy, y-this.offsetY, y);
            }
            this.drawCustomYTicks();
        };
        this.drawAxis = function() {
            if(this.yAxisVisible) {
                this.drawYAxis();
            }
            if(this.xAxisVisible) {
                this.drawXAxis();
            }
            if(this.xAxisVisible && this.yAxisVisible) {
                this.drawAxis0Point();
            }
            if(this.axisValues) {
                if(this.xAxisVisible) {
                    this.drawXTicks();
                }
                if(this.yAxisVisible) {
                    this.drawYTicks();
                }
            }
        };
        this.drawGrid = function() {
            var dx = this.gridStepX*this.stepX;
            var modX = this.offsetX%(dx);
            for(var x = -this.offsetX+modX; x <= this.width-this.offsetX; x += dx) {
                //pionowe
                this.svg.line(this.svgDoc.find('.grid'), x, -this.offsetY, x, -this.height-this.offsetY);
            }

            var dy = this.gridStepY*this.stepY;
            var modY = this.offsetY%(dy);
            for(var y = -this.offsetY+modY; y >= -this.height-this.offsetY; y -= dy) {
                //poziome
                this.svg.line(this.svgDoc.find('.grid'), -this.offsetX, y, this.width-this.offsetX, y);
            }
        };
        this.drawPoints = function() {
            var dx = this.gridStepX*this.stepX;
            var modX = this.offsetX%(dx);
            var dy = this.gridStepY*this.stepY;
            var modY = this.offsetY%(dy);
            var point;
            var html = $('<span class="point"></span>');
            for(var x = -this.offsetX+modX; x <= this.width-this.offsetX; x += dx) {
                var idx = 0;
                for(var y = -this.offsetY+modY; y >= -this.height-this.offsetY; y -= dy) {
                    point = this.px2coords(x+this.offsetX,dy*idx-modY);
                    this.svg.circle(this.svgDoc.find('.points'), x, y, this.pointOutlineRadius, {
                        'class':'point_outline_base',
                        vx:point.x,
                        vy:point.y
                        });
                    this.svg.circle(this.svgDoc.find('.points'), x, y, this.pointRadius, {
                        'class':'point',
                        vx:point.x,
                        vy:point.y
                        });
                    if(this.interactive) {
                        this.svg.rect(this.svgDoc.find('.pointsAreas'), x-this.pointActiveArea/2, y-this.pointActiveArea/2, this.pointActiveArea, this.pointActiveArea, {
                            'class':'point_active_area',
                            vx:point.x,
                            vy:point.y
                            });
                    }
                    idx++;
                }
            }
            $.each(plot.selectedPoints, function(k, v) {
                var refObj = plot.svgDoc.find('.point[vx="'+v.x+'"][vy="'+v.y+'"]');
                var refObjOutline = plot.svgDoc.find('.point_outline_base[vx="'+v.x+'"][vy="'+v.y+'"]');
                refObj.addClass('point_selected');
                refObjOutline.addClass('point_outline');
                if(!v.clickable) {
                    refObj.addClass('nonclickable');
                }
            });

            if(this.interactive) {
                obj = this.svgDoc.find('.point_active_area');
                obj.mouseover(function() {
                    var vx = $(this).attr('vx');
                    var vy = $(this).attr('vy');
                    var point;
                    var point = plot.svgDoc.find('.point[vx="'+vx+'"][vy="'+vy+'"]');
                    if(plot.maxSelectedPoints == 0 || plot.selectedPoints.length < plot.maxSelectedPoints || point.hasClass('point_selected')) {
                        point = plot.svgDoc.find('.point[vx="'+vx+'"][vy="'+vy+'"]');
                        if(!point.hasClass('nonclickable')) {
                            point.addClass('point_over');
                        }
                    }
                });
                obj.mouseout(function() {
                    var vx = $(this).attr('vx');
                    var vy = $(this).attr('vy');
                    plot.svgDoc.find('.point[vx="'+vx+'"][vy="'+vy+'"]').removeClass('point_over');
                });
                obj.click(function(e) {
                    e.stopPropagation();

                    var vx = $(this).attr('vx');
                    var vy = $(this).attr('vy');
                    var refObj = plot.svgDoc.find('.point[vx="'+vx+'"][vy="'+vy+'"]');
                    if(!refObj.hasClass('nonclickable')) {
                        if(refObj.hasClass('point_selected')) {
                            plot._deselectPoint(vx, vy);
                        } else {
                            plot._selectPoint(vx, vy);
                        }
                    }
                });
            }
        };
        this._touchPoint = function(x, y) {
            var pvx = parseFloat(x);
            var pvy = parseFloat(y);
            //mark as touched in model if exists
            $.each(plot.points, function(k,v) {
                if(v.x == pvx && v.y == pvy) {
                    v.touched = true;
                }
            });
        }
        this._deselectPoint = function(x,y) {
            this._touchPoint(x, y);
            var pvx = parseFloat(x);
            var pvy = parseFloat(y);
            var refObj = plot.svgDoc.find('.point[vx="'+x+'"][vy="'+y+'"]');
            var refObjOutline = plot.svgDoc.find('.point_outline_base[vx="'+x+'"][vy="'+y+'"]');
            refObj.removeClass('point_selected');
            refObjOutline.removeClass('point_outline');
            $.each(this.selectedPoints, function(k, v) {
                if(v.x == pvx && v.y == pvy) {
                    plot.selectedPoints.splice(k, 1);
                    plot.stateChanged({
                        item:'point_'+pvx+'_'+pvy,
                        value:0,
                        score:plot.getPointEventScore(pvx, pvy, plot.STATE_DESELECT_POINT)
                    });
                    return false;
                }
            });
        }
        this._selectPoint = function(x,y) {
            this._touchPoint(x, y);
            var pvx = parseFloat(x);
            var pvy = parseFloat(y);
            var refObj = plot.svgDoc.find('.point[vx="'+x+'"][vy="'+y+'"]');
            var refObjOutline = plot.svgDoc.find('.point_outline_base[vx="'+x+'"][vy="'+y+'"]');
            //check if we can add another point
            if(plot.maxSelectedPoints == 0 || plot.selectedPoints.length < plot.maxSelectedPoints) {
                refObj.addClass('point_selected');
                refObjOutline.addClass('point_outline');
                var hasPoint = false;
                $.each(plot.selectedPoints, function(k, v) {
                    if(v.x == pvx && v.y == pvy) {
                        hasPoint = true;
                        return false;
                    }
                });
                if(!hasPoint) {
                    plot.selectedPoints.push({
                        x:pvx,
                        y:pvy,
                        clickable: true
                    });
                    plot.stateChanged({
                        item:'point_'+pvx+'_'+pvy,
                        value:1,
                        score:plot.getPointEventScore(pvx, pvy, plot.STATE_SELECT_POINT)
                    });
                }
            }
        }
        this.removePlot = function(p) {
            this.svgDoc.find('.drawingsAreas .draw_active_area[refuid="'+p+'"]').remove();
            this.svgDoc.find('.drawings .draw_outline_base[ouid="'+p+'"]').remove();
            this.svgDoc.find('.drawings .draw[uid="'+p+'"]').remove();
        }
        this.drawPlot = function(p) {
            var obj, cp;
            var path = this.svg.createPath();
            //function type x to y
            if(this.expressions[p].type == this.TYPE_X_TO_Y) {
                path = this._drawXToY(p);
            //function type y to x
            } else if(this.expressions[p].type == this.TYPE_Y_TO_X) {
                path = this._drawYToX(p);
            }
            this.svg.path(this.svgDoc.find('.drawings'), path, {
                ouid:p,
                'class': 'draw_outline_base'
            });
            this.svg.path(this.svgDoc.find('.drawings'), path, {
                uid:p,
                isselected: this.expressions[p].selected ? 1 : 0,
                'class': 'is_plot draw draw_'+(parseInt(p)+1)
            });
            //store style
            cp = plot.svgDoc.find('.drawings [uid="'+p+'"]');
            cp.data({
                cssStyle: this._composeStyle({
                    'stroke': this.expressions[p].cssColor
                })
            });
            cp.attr('style', cp.data().cssStyle);
            if(this.interactive) {
                this.svg.path(this.svgDoc.find('.drawingsAreas'), path, {
                    refuid:p,
                    'class':'draw_active_area'
                });
            }
            if(this.expressions[p].selected) {
                plot.svgDoc.find('.is_plot[uid="'+p+'"]').addClass('draw_selected draw_'+(parseInt(p)+1)+'_selected').removeAttr('style');
                plot.svgDoc.find('.draw_outline_base[ouid="'+p+'"]').addClass('draw_outline draw_'+(parseInt(p)+1)+'_outline');
            }
            if(this.expressions[p].selectable && this.interactive) {
                obj = this.svgDoc.find('.draw_active_area[refuid="'+p+'"]');
                obj.mouseover(function() {
                    var id = parseInt($(this).attr('refuid'));
                    p = plot.svgDoc.find('.is_plot[uid="'+id+'"]');
                    p.addClass('draw_over draw_'+(id+1)+'_over').removeAttr('style');
                });
                obj.mouseout(function() {
                    var id = parseInt($(this).attr('refuid'));
                    p = plot.svgDoc.find('.is_plot[uid="'+id+'"]');
                    p.removeClass('draw_over draw_'+(id+1)+'_over');
                    if(p.attr('isselected') != 1) {
                        p.attr('style', p.data().cssStyle);
                    }
                });
                obj.click(function(e) {
                    e.stopPropagation();

                    var id = parseInt($(this).attr('refuid'));
                    var refObj = plot.svgDoc.find('.is_plot[uid="'+id+'"]');
                    var refObjOutline = plot.svgDoc.find('.draw_outline_base[ouid="'+id+'"]');
                    var selected = parseInt(refObj.attr('isselected'));
                    plot.expressions[id].touched = true;
                    if(selected) {
                        refObj.attr('isselected', 0);
                        refObj.attr('style', refObj.data().cssStyle);
                        refObj.removeClass('draw_selected draw_'+(id+1)+'_selected');
                        refObjOutline.removeClass('draw_outline draw_'+(id+1)+'_outline');
                        plot.expressions[id].selected = false;
                        plot.stateChanged({
                            item:'plot_'+plot.expressions[id].id,
                            value:0,
                            score: plot.getPlotEventScore(plot.expressions[id].id)
                        });
                    } else {
                        refObj.attr('isselected', 1);
                        refObj.addClass('draw_selected draw_'+(id+1)+'_selected');
                        refObj.removeAttr('style');
                        refObjOutline.addClass('draw_outline draw_'+(id+1)+'_outline');
                        plot.expressions[id].selected = true;
                        plot.stateChanged({
                            item:'plot_'+plot.expressions[id].id,
                            value:1,
                            score: plot.getPlotEventScore(plot.expressions[id].id)
                        });
                    }
                });
            }
        }
        this.drawPlots = function() {
            $.each(this.expressions, function(idx, val) {
                if(val.visible) {
                    plot.drawPlot(idx);
                }
            });
        };
        this._drawYToX = function(p) {
            var path = this.svg.createPath();
            var rx, ry, i;
            var idx = 0;
            var values = [];
            var sy = -this.offsetY;
            var ey = -this.height-this.offsetY;
            var domain = this._getPlotDomain(p);
            var xMin = domain.xMin;
            var xMax = domain.xMax;
            var yMin = domain.yMin;
            var yMax = domain.yMax;

            //create variables for parser
            var variables = this._mapPlotVariables(p);

            for(i = sy; i >= ey; i--) {
                ry = this.yMax-(idx)/this.stepY;
                //add x to parser variables
                variables.y = ry;
                try {
                    rx = Parser.evaluate(this.expressions[p].expression, variables);
                } catch (e) {
                    break;
                }
                if(rx > this.INFINITY_POSITIVE_VALUE) {
                    //console.log(i,ry,'-n');
                    rx = Infinity;
                }
                if(rx < this.INFINITY_NEGATIVE_VALUE) {
                    //console.log(i,ry,'+n');
                    rx = -Infinity;
                }

                values.push({
                   rx: rx.toFixed(5),
                   ry: ry.toFixed(5),
                   i: i
                });

                idx++;
            }

            var d1 = d2 = d3 = dX = 0;
            var asymptote = false;
            var positioning = true; //set position at the beginning of drawing
            var closedAsymptote = false;
            var prevXMin = prevXMax = prevYMin = prevYMax = false;

            for(var j = 0; j<values.length; j+=1) {
                ry = values[j].ry;
                rx = values[j].rx;
                i = values[j].i;

                //yMin is set
                if(yMin !== null) {
                    //range check
                    if(ry < yMin) {
                        prevYMin = ry;
                        positioning = true;
                        continue;
                    }
                    //if we pass from out of range to in range
                    if(prevYMin !== false && prevYMin < yMin && ry >= yMin) {
                        prevYMin = false;
                        //console.log('przejscie xmin',i,rx)
                        //calculate equation for xMin
                        variables.y = yMin;
                        try {
                            rx = Parser.evaluate(this.expressions[p].expression, variables);
                        } catch (e) {
                            break;
                        }
                        //force to draw y at draw point x
                        i = this.coords2px(0, yMin).y;
                    }
                }

                //yMax is set
                if(yMax !== null) {
                    //we are in range
                    if(ry <= yMax) {
                        prevYMax = ry;
                    }
                    //we pass xMax
                    if(prevYMax !== false && prevYMax <= yMax && ry > yMax) {
                        prevYMax = false;
                        //console.log('przejscie xmax',i,rx)
                        //calculate equation for xMin
                        variables.y = yMax;
                        try {
                            rx = Parser.evaluate(this.expressions[p].expression, variables);
                        } catch (e) {
                            break;
                        }
                        //force draw x value
                        i = this.coords2px(0,yMax).y;
                    } else if(ry > yMax) {
                        positioning = true;
                        prevYMax = false;
                        continue;
                    }
                }

                if(xMin !== null) {
                    //range check
                    if(rx < xMin) {
                        prevXMin = rx;
                    }
                    //if we pass from out of range to in range - open path with yMin
                    if(prevXMin !== false && prevXMin < xMin && rx >= xMin) {
                        positioning = true;
                        prevXMin = false;
                        //console.log('wejscie xmin',i,rx,ry);
                        rx = xMin;
                    } else if(j>0 && values[j-1].rx >= xMin && rx < xMin)  {
                        //if we pass from in range to out of range (close path)
                        positioning = false;
                        //console.log('zejscie xmin', i, rx, ry);
                        rx = xMin;
                    } else if( rx < xMin){
                        continue;
                    }
                }

                if(xMax !== null) {
                    if(rx <= xMax) {
                        prevXMax = rx;
                    }
                    //we pass yMax
                    if(prevXMax !== false && prevXMax <= xMax && rx > xMax) {
                        prevXMax = false;
                        //console.log('zejscie poza xmax',j,i,rx,ry)
                        rx = xMax;
                    } else if(j > 0 && values[j-1].rx > xMax && rx <= xMax) {
                        //console.log('wejscie z poza xmax',j,i,rx,ry,values[j-1].ry )
                        positioning = true;
                        rx = xMax;
                    } else if(rx > xMax) {
                        positioning = true;
                        prevXMax = false;
                        continue;
                    }
                }

                if(j > this.ASYMPTOTE_MINIMUM_TRIAL) {
                    dX = rx-values[j-1].rx;
                    d3 = values[j-1].rx - values[j-2].rx;
                    d2 = values[j-2].rx - values[j-3].rx;
                    d1 = values[j-3].rx - values[j-4].rx;
                }

                //detect discontinuous
                if(this.isDiscontinuous(d1, d2, d3, dX)) {
                    rx = Number.NaN;
                }

                //detect asymptote
                asymptote=this.hasAsymptote(d1, d2, d3, dX);

                if(asymptote.asymptote) {
                    //console.log('Asymptote: ',i, j,asymptote.asymptote,asymptote.val, rx,ry,'d:',d1,d2,d3,dX);
                    //draw graph to -+Infinity
                    //draw to -Infinity
                    if(!closedAsymptote) {
                        //draw to -Infinity
                        if(asymptote.val == 1) {
                            //if prevoius value was in range draw closing asymptote line
                            if(j>0 && values[j-1].rx >= xMin && rx < xMin) {
                                path.line((this.xMin*this.stepX).toFixed(5), i);
                            }
                            path.move((this.xMax*this.stepX).toFixed(5), i);
                            //console.log(i,'-n closing');
                            closedAsymptote = true;
                        }
                        //draw to +Infinity
                        if(asymptote.val == -1) {
                            //if prevoius value was in range draw closing asymptote line
                            if(j > 0 && !(values[j-1].rx > xMax && rx <= xMax)) {
                                path.line((this.xMax*this.stepX).toFixed(5), i);
                            }
                            path.move((this.xMin*this.stepX).toFixed(5), i);
                            //console.log(i,'+n closing');
                            closedAsymptote = true;
                        }
                    }
                } else {
                    closedAsymptote = false;
                    //if point in range
                    if(rx != Infinity && rx != -Infinity && !isNaN(rx)) {
                        //set starting point
                        if(positioning) {
                            path.move((rx*this.stepX).toFixed(5), i);
                            positioning = false;
                        }
                        //draw
                        if(!positioning) {
                            path.line((rx*this.stepX).toFixed(5),i);
                        }
                    } else {
                        positioning = true;
                    }
                }
            }

            return path;
        }

        this.isDiscontinuous = function(d1, d2, d3, dY) {
            if(Math.abs(dY) > this.asymptoteMinimumDY && d1 == 0 && d2 == 0 && d3 == 0 && dY != 0) {
                return true;
            }
        };

        //detect asymptote
        this.hasAsymptote = function(d1, d2, d3, dY) {
            //if dY is greater than minimum step or is equal to +- infinity check deltas
            if(Math.abs(dY) > this.asymptoteMinimumDY || dY == -Infinity || dY == Infinity) {
                if(d1 > 0 && d2 > 0 && d3 > 0 && d1 < d2 && d2 < d3)	{
                    if(dY < d3) {
                        return {
                            asymptote: true,
                            val: -1
                        };
                    } else {
                        return {
                            asymptote: false,
                            val: 0
                        };
                    }
                }
                if(d1 < 0 && d2 < 0 && d3 < 0 && d1 > d2 && d2 > d3) {
                    if(dY > d3) {
                        return {
                            asymptote: true,
                            val: 1
                        };
                    } else {
                        return {
                            asymptote: false,
                            val: 0
                        };
                    }
                }
            }

            return {
                asymptote: false,
                val: 0
            };
        }
        this._mapPlotVariables = function(p) {
            var variables = {};
            $.each(this.expressions[p].variables, function(k,v) {
                variables[k] = v.value;
            });

            return variables;
        }
        this._getPlotDomain = function(p) {
            var variables = this._mapPlotVariables(p);
            var xMin = this.expressions[p].xMin !== false ? Parser.evaluate(this.expressions[p].xMin.toString(), variables) : null;
            var xMax = this.expressions[p].xMax !== false ? Parser.evaluate(this.expressions[p].xMax.toString(), variables) : null;
            var yMin = this.expressions[p].yMin !== false ? Parser.evaluate(this.expressions[p].yMin.toString(), variables) : null;
            var yMax = this.expressions[p].yMax !== false ? Parser.evaluate(this.expressions[p].yMax.toString(), variables) : null;
            if(xMin === null || xMin < this.xMin) {
                xMin = this.xMin;
            }
            if(xMax === null || xMax > this.xMax) {
                xMax = this.xMax;
            }
            if(yMin === null || yMin < this.yMin) {
                yMin = this.yMin;
            }
            if(yMax === null || yMax > this.yMax) {
                yMax = this.yMax;
            }

            return {xMin: xMin, xMax:xMax, yMin: yMin, yMax: yMax};
        }
        this._drawXToY = function(p) {
            var path = this.svg.createPath();
            var rx, ry, i;
            var values = [];
            var sx = -this.offsetX;
            var ex = sx+this.width;
            var domain = this._getPlotDomain(p);
            var xMin = domain.xMin;
            var xMax = domain.xMax;
            var yMin = domain.yMin;
            var yMax = domain.yMax;

            //create variables for parser
            var variables = this._mapPlotVariables(p);

            //calculate values for every pixel
            for(i = sx; i <= ex; i++) {
                rx = this.xMin+(i-sx)/this.stepX;
                //add x to parser variables
                variables.x = rx;
                try {
                    ry = Parser.evaluate(this.expressions[p].expression, variables);
                } catch (e) {
                    break;
                }
                if(ry > this.INFINITY_POSITIVE_VALUE) {
                    //console.log(i,ry,'-n');
                    ry = Infinity;
                }
                if(ry < this.INFINITY_NEGATIVE_VALUE) {
                    //console.log(i,ry,'+n');
                    ry = -Infinity;
                }

                values.push({
                   rx: rx.toFixed(5),
                   ry: ry.toFixed(5),
                   i: i
                });
            }

            var d1 = d2 = d3 = dY = 0;
            var asymptote = false;
            var positioning = true; //set position at the beginning of drawing
            var closedAsymptote = false;
            var prevXMin = prevXMax = prevYMin = prevYMax = false;

            for(var j = 0; j<values.length; j+=1) {
                ry = values[j].ry;
                rx = values[j].rx;
                i = values[j].i;

                //xMin is set
                if(xMin !== null) {
                    //range check
                    if(rx < xMin) {
                        prevXMin = rx;
                        positioning = true;
                        continue;
                    }
                    //if we pass from out of range to in range
                    if(prevXMin !== false && prevXMin < xMin && rx >= xMin) {
                        prevXMin = false;
                        //console.log('przejscie xmin',i,rx)
                        //calculate equation for xMin
                        variables.x = xMin;
                        try {
                            ry = Parser.evaluate(this.expressions[p].expression, variables);
                        } catch (e) {
                            break;
                        }
                        //force to draw y at draw point x
                        i = this.coords2px(xMin, 0).x;
                    }
                }

                //xMax is set
                if(xMax !== null) {
                    //we are in range
                    if(rx <= xMax) {
                        prevXMax = rx;
                    }
                    //we pass xMax
                    if(prevXMax !== false && prevXMax <= xMax && rx > xMax) {
                        prevXMax = false;
                        //console.log('przejscie xmax',i,rx)
                        //calculate equation for xMin
                        variables.x = xMax;
                        try {
                            ry = Parser.evaluate(this.expressions[p].expression, variables);
                        } catch (e) {
                            break;
                        }
                        //force draw x value
                        i = this.coords2px(xMax, 0).x;
                    } else if(rx > xMax) {
                        positioning = true;
                        prevXMax = false;
                        continue;
                    }
                }

                if(yMin !== null) {
                    //range check
                    if(ry < yMin) {
                        prevYMin = ry;
                    }

                    //if we pass from out of range to in range - open path with yMin
                    if(prevYMin !== false && prevYMin < yMin && ry >= yMin) {
                        positioning = true;
                        prevYMin = false;
                        //console.log('wejscie ymin',i,rx,ry);
                        ry = yMin;
                    } else if(j>0 && values[j-1].ry >= yMin && ry < yMin)  {
                        //if we pass from in range to out of range (close path)
                        positioning = false;
                        //console.log('zejscie ymin', i, rx, ry);
                        ry = yMin;
                    } else if( ry < yMin){
                        continue;
                    }
                }

                if(yMax !== null) {
                    if(ry <= yMax) {
                        prevYMax = ry;
                    }
                    //we pass yMax
                    if(prevYMax !== false && prevYMax <= yMax && ry > yMax) {
                        prevYMax = false;
                        //console.log('zejscie poza ymax',j,i,rx,ry)
                        ry = yMax;
                    } else if(j > 0 && values[j-1].ry > yMax && ry <= yMax) {
                        //console.log('wejscie z poza ymax',j,i,rx,ry,values[j-1].ry )
                        positioning = true;
                        ry = yMax;
                    } else if(ry > yMax) {
                        positioning = true;
                        prevYMax = false;
                        continue;
                    }
                }

                //calculate deltas
                if(j > this.ASYMPTOTE_MINIMUM_TRIAL) {
                    dY = ry-values[j-1].ry;
                    d3 = values[j-1].ry - values[j-2].ry;
                    d2 = values[j-2].ry - values[j-3].ry;
                    d1 = values[j-3].ry - values[j-4].ry;
                }

                //detect discontinuous
                if(this.isDiscontinuous(d1, d2, d3, dY)) {
                    ry = Number.NaN;
                }
                //detect asymptote
                asymptote=this.hasAsymptote(d1, d2, d3, dY);

                if(asymptote.asymptote) {
                    //console.log('Asymptote: ',i, j,asymptote.asymptote,asymptote.val, rx,ry,'d:',d1,d2,d3,dY);
                    //draw graph to -+Infinity
                    //draw to -Infinity
                    if(!closedAsymptote) {
                        //draw to -Infinity
                        if(asymptote.val == 1) {
                            //if prevoius value was in range draw closing asymptote line
                            if(j>0 && values[j-1].ry >= yMin && ry < yMin) {
                                path.line(i, (this.yMin*this.stepY).toFixed(5));
                            }
                            path.move(i, (this.yMax*this.stepY).toFixed(5));
                            //console.log(i,'-n closing');
                            closedAsymptote = true;
                        }
                        //draw to +Infinity
                        if(asymptote.val == -1) {
                            //if prevoius value was in range draw closing asymptote line
                            if(j > 0 && !(values[j-1].ry > yMax && ry <= yMax)) {
                                path.line(i, (this.yMax*this.stepY).toFixed(5));
                            }
                            path.move(i, (this.yMin*this.stepY).toFixed(5));
                            //console.log(i,'+n closing');
                            closedAsymptote = true;
                        }
                    }
                }  else {
                    closedAsymptote = false;
                    //if point in range
                    if(ry != Infinity && ry != -Infinity && !isNaN(ry)) {
                        //set starting point
                        if(positioning) {
                            path.move(i, (ry*this.stepY).toFixed(5));
                            positioning = false;
                        }
                        //draw
                        if(!positioning) {
                            path.line(i, (ry*this.stepY).toFixed(5));
                        }
                    } else {
                        positioning = true;
                    }
                }
            }

            return path;
        }
        this.reset = function() {
            $.each(this.expressions, function(idx, val) {
                if(val.selectable) {
                    val.selected = false;
                }
                val.touched = false;
            })

            this.selectedPoints = [];
            $.each(this.points, function(idx, val) {
                if(val.initiallySelected) {
                    plot.selectedPoints.push({
                        x: val.x,
                        y: val.y,
                        clickable: val.clickable
                    });
                }
            });
            this.uiEnabled = true;
            this.restoreInitialViewPort();
        }
        this.restoreInitialViewPort = function() {
            this.xMin = this.initXMin;
            this.xMax = this.initXMax;
            this.yMin = this.initYMin;
            this.yMax = this.initYMax;
            this.setStep();
            this.translate();
            this.draw();
        }
        this.coords2px = function(cx, cy) {
            return {
                x:cx*this.stepX,
                y:cy*this.stepY
            }
        };
        this.px2coords = function(px, py) {
            var xRange = Math.max(this.xMin, this.xMax) - Math.min(this.xMin, this.xMax);
            var yRange = Math.max(this.yMin, this.yMax) - Math.min(this.yMin, this.yMax);

            var x = px*xRange/this.width+this.xMin;
            x = Math.round(this.precision.x*x)/this.precision.x;
            var y = (py*yRange/this.height)*(-1)+this.yMax;
            y = Math.round(this.precision.y*y)/this.precision.y;

            return {
                x: x,
                y: y
            };
        };

        this.calculateRange = function() {
            var xRange = Math.max(this.xMin, this.xMax) - Math.min(this.xMin, this.xMax);
            var offsetX = this.lastOffsetX*xRange/this.width
            this.lastOffsetX = 0;
            this.xMin -= offsetX;
            this.xMax -= offsetX;

            var yRange = Math.max(this.yMin, this.yMax) - Math.min(this.yMin, this.yMax);
            var offsetY = this.lastOffsetY*yRange/this.height
            this.lastOffsetY = 0;

            this.yMin -= offsetY;
            this.yMax -= offsetY;

            this.setStep();
        };

        this.calculatePrecision = function() {
            var idx = this.gridStepX.toString().indexOf('.');
            var idy = this.gridStepY.toString().indexOf('.');
            this.precision.x = idx !== -1 ? Math.pow(10, this.gridStepX.toString().length - idx - 1) : 100;
            this.precision.y = idy !== -1 ? Math.pow(10, this.gridStepY.toString().length - idx - 1) : 100;
        };

        /**
         * param int direction - -1 zoomOut, +1 zoomIn
         **/
        this.zoom = function(direction) {
            this.xMin -= this.xMin*this.zoomStep*direction;
            this.xMax -= this.xMax*this.zoomStep*direction;
            this.yMin -= this.yMin*this.zoomStep*direction;
            this.yMax -= this.yMax*this.zoomStep*direction;
            this.setStep();
            this.draw();
        };

        this.move = function(dx, dy) {
            this.offsetX += dx;
            this.offsetY += dy;
            this.svgDoc.find('.translate').attr('transform', 'translate('+this.offsetX+', '+this.offsetY+')');
            this.lastOffsetX = dx;
            this.lastOffsetY = dy;
            this.calculateRange();
            this.draw();
        };
        this._composeStyle = function(style) {
            var formattedStyle = '';
            $.each(style, function(o, v) {
                if(v!='') {
                    formattedStyle += o+':'+v+';'
                }
            });
            return formattedStyle;
        }
        this.enableUI = function(state) {
            this.svgDoc.find('.blocker').remove();
            if(state) {
                this.uiEnabled = true;
            } else {
                this.uiEnabled = false;
                this.svg.polygon(this.svgDoc.find('.overall'), [[-this.offsetX,-this.offsetY], [this.width-this.offsetX,-this.offsetY], [this.width-this.offsetX,-this.height-this.offsetY], [-this.offsetX, -this.height-this.offsetY]], {
                    'class':'blocker',
                    fill: '#000000',
                    'fill-opacity':0,
                    strokeWidth: 0
                });
            }
        }
        this.setVariable = function(id, variable, value) {
            if(id != '' && variable != '') {
                $.each(this.expressions, function(idx, val){
                    if(val.id == id) {
                        if(val.variables[variable] != undefined) {
                            val.variables[variable]['value'] = value != '' ? value : 0;
                            if(val.variables[variable]['isExercise']) {
                                val.variables[variable]['touched'] = true;
                                //call chain of events
                                plot.stateChanged([
                                {
                                    item:'variable_'+val.id+'_'+variable,
                                    value:value,
                                    score: plot.isCorrectVariable(val.id, variable)
                                },

                                {
                                    item:'variables_'+val.id+'_'+variable,
                                    value:'',
                                    score: plot.areCorrectPlotVariables(val.id)
                                }
                                ]);
                            }
                        }
                        plot.removePlot(idx);
                        if(val.visible) {
                            plot.drawPlot(idx);
                        }
                    }

                });
            }
        }
        this.setVisible = function(id, value) {
            if(id != '') {
                $.each(this.expressions, function(idx, val) {
                    if(val.id == id) {
                        val.visible = value;
                        //remove existing plot
                        plot.removePlot(idx);
                        //show plot
                        if(value) {
                            plot.drawPlot(idx);
                        }
                    }
                });
            }
        }
        this.setPointVisibility = function(x, y, visibility) {
            if(x != '' && y != '') {
                var refObj = plot.svgDoc.find('.point[vx="'+x+'"][vy="'+y+'"]');
                var refObjOutline = plot.svgDoc.find('.point_outline_base[vx="'+x+'"][vy="'+y+'"]');
                if(visibility && !refObj.hasClass('point_selected')) {
                    this._selectPoint(x, y);
                } else if(!visibility && refObj.hasClass('point_selected')) {
                    this._deselectPoint(x, y);
                }
            }
        }
        this.setPlotStyle = function(id, type, prop, value) {
            if(id != '') {
                $.each(this.expressions, function(idx, val) {
                    if(val.id == id) {
                        if(type == 'plot' && (prop == 'color' || prop == 'stroke')) {
                            val.cssColor = value;
                            //remove existing plot
                            plot.removePlot(idx);
                            //show plot
                            if(val.visible) {
                                plot.drawPlot(idx);
                            }
                        }
                    }
                });
            }
        }
        this.plotVariablesResult = function(plotId) {
            //check variables
            var variablesTodo = 0;
            var variablesDone = 0;
            var touched = false;
            $.each(this.expressions[plotId].variables, function(k,v) {
                if(v.isExercise) {
                    variablesTodo++;
                    if(v.expectedValue == v.value) {
                        variablesDone++;
                    }
                    if(v.touched) {
                        touched = true;
                    }
                }
            });

            return {
                todo: variablesTodo,
                done: variablesDone,
                touched: touched
            };
        };

        this.getPlotEventScore = function(pid) {
            if(!this.isActivity) {
                return this.STATE_NOT_ACTIVITY;
            }
            var state = this.STATE_INCORRECT;
            $.each(this.expressions, function(idx, val) {
                if(val.id == pid) {
                    if(val.selected == val.correctAnswer && val.correctAnswer == true) {
                        state = plot.STATE_CORRECT;
                    } else if((val.correctAnswer == true && val.selected == false) || (val.correctAnswer == false && val.selected == false)) {
                        state = plot.STATE_NULL;
                    } else if(val.correctAnswer == false && val.selected == true) {
                        state = plot.STATE_INCORRECT;
                    }
                    return false;
                }
            });
            return state;
        };
        this.isPointOnPlot = function(pid, x, y) {
            var rv, rc, domain;
            var isCorrect = false;
            $.each(this.expressions, function(idx, val) {
                if (val.id == pid) {
                    var variables = plot._mapPlotVariables(idx);
                    if(val.type == plot.TYPE_X_TO_Y) {
                        rc = y;
                        variables.x = x;
                    } else {
                        rc = x;
                        variables.y = y;
                    }
                    try {
                        rv = Parser.evaluate(plot.expressions[idx].expression, variables);
                    } catch (e) {
                        return false;
                    }

                    isCorrect = rv == rc;

                    //check if point is in range
                    if(isCorrect) {
                        domain = plot._getPlotDomain(idx);
                        if(x < domain.xMin || x > domain.xMax || y < domain.yMin || y > domain.yMax) {
                            isCorrect = false;
                        }
                    }
                    return false;
                }
            });

            return isCorrect;
        };
        this.getPointEventScore = function(vx, vy, state) {
            var currentState = this.STATE_NULL;
            var pointInDefinedPoints = false;
            if(!this.isActivity || (this.points.length == 0 && this.freePoints)) {
                return this.STATE_NOT_ACTIVITY;
            }

            //check point in model points
            $.each(this.points, function(idx, val) {
                //we have this point
                if(val.x == vx && val.y == vy) {
                    //check if should be selected or not
                    if((val.correct && state == plot.STATE_SELECT_POINT) || (!val.correct && state == plot.STATE_DESELECT_POINT)) {
                        currentState = plot.STATE_CORRECT;
                    } else if(state == plot.STATE_SELECT_POINT) {
                        currentState = plot.STATE_INCORRECT;
                    } else {
                        currentState = plot.STATE_NULL;
                    }
                    pointInDefinedPoints = true;
                    return false;
                }
            });

            if(pointInDefinedPoints) {
                return currentState;
            } else {
                return state == this.STATE_SELECT_POINT ? this.STATE_INCORRECT : this.STATE_NULL;
            }
        };

        this.isCorrectVariable = function(pid, variable) {
            var state = this.STATE_INCORRECT;
            if(!this.isActivity) {
                return this.STATE_NOT_ACTIVITY;
            }

            $.each(this.expressions, function(idx, val) {
                if(val.id == pid) {
                    state = val.variables[variable].value == val.variables[variable].expectedValue ? plot.STATE_CORRECT : plot.STATE_INCORRECT;
                    return false;
                }
            });

            return state;
        }

        this.areCorrectPlotVariables = function(pid) {
            if(!this.isActivity) {
                return this.STATE_NOT_ACTIVITY;
            }

            var state = this.STATE_CORRECT;
            $.each(this.expressions, function(idx, val) {
                if(val.id == pid) {
                    $.each(val, function(vidx, variableObj) {
                        if(variableObj.isExercise && variableObj.value != variableObj.expectedValue) {
                            state = plot.STATE_INCORRECT;
                            return false;
                        }
                    })
                }
            })

            return state;
        }
    }

    var presenter = function(){};
    var addonID;
    var plot = new Plot();

    presenter.setWorkMode = function(){
        var ref;
        if(!presenter.isActivity) {
            return;
        }

        presenter.errorsMode = false;
        $.each(plot.expressions, function(idx, val) {
            ref = plot.svgDoc.find('.is_plot[uid="'+idx+'"]');
            if(ref.length > 0) {
                ref.removeClass('draw_mark_error draw_'+(parseInt(idx)+1)+'_mark_error draw_mark_correct draw_'+(parseInt(idx)+1)+'_mark_correct');
                ref.attr('style', ref.data().cssStyle);
                plot.svgDoc.find('.draw_outline_base[ouid="'+idx+'"]').removeClass('draw_outline_mark_error draw_'+(parseInt(idx)+1)+'_outline_mark_error draw_outline_mark_correct draw_'+(parseInt(idx)+1)+'_outline_mark_correct');
            }
        });
        this.removePointsStateMarks();
        plot.enableUI(true);
    };
    presenter.removePointsStateMarks = function() {
        plot.svgDoc.find('.point_error').removeClass('point_error');
        plot.svgDoc.find('.point_outline_mark_error').removeClass('point_outline_mark_error');
        plot.svgDoc.find('.point_correct').removeClass('point_correct');
        plot.svgDoc.find('.point_outline_mark_correct').removeClass('point_outline_mark_correct');
    };
    presenter.markPointAsError = function(x, y) {
        plot.svgDoc.find('.point[vx="' + x + '"][vy="' + y + '"]').addClass('point_error');
        plot.svgDoc.find('.point_outline_base[vx="' + x + '"][vy="' + y + '"]').addClass('point_outline_mark_error');
    };
    presenter.markPointAsCorrect = function(x, y) {
        plot.svgDoc.find('.point[vx="' + x + '"][vy="' + y + '"]').addClass('point_correct');
        plot.svgDoc.find('.point_outline_base[vx="' + x + '"][vy="' + y + '"]').addClass('point_outline_mark_correct');
    };
    presenter.setShowErrorsMode = function() {
        if(!presenter.isActivity) {
            return;
        }

        var res;
        presenter.errorsMode = true;
        plot.enableUI(false);

        $.each(plot.expressions, function(idx, val) {
            if(val.selectable && val.touched) {
                if(val.correctAnswer == false && val.selected == true) {
                    //mark error
                    plot.svgDoc.find('.is_plot[uid="'+idx+'"]').addClass('draw_mark_error draw_'+(parseInt(idx)+1)+'_mark_error').removeAttr('style');
                    plot.svgDoc.find('.draw_outline_base[ouid="'+idx+'"]').addClass('draw_outline_mark_error draw_'+(parseInt(idx)+1)+'_outline_mark_error');
                } else if(val.correctAnswer == true && val.selected == true) {
                    //mark as correct only plots which are selectable, selected, touched and it\'s correct answer is true (selected)
                    plot.svgDoc.find('.is_plot[uid="'+idx+'"]').addClass('draw_mark_correct draw_'+(parseInt(idx)+1)+'_mark_correct').removeAttr('style');
                    plot.svgDoc.find('.draw_outline_base[ouid="'+idx+'"]').addClass('draw_outline_mark_correct draw_'+(parseInt(idx)+1)+'_outline_mark_correct');
                }
            }
            res = plot.plotVariablesResult(idx);
            if(res.todo != res.done && res.todo > 0 && res.touched) {
                //mark error
                plot.svgDoc.find('.is_plot[uid="'+idx+'"]').addClass('draw_mark_error draw_'+(parseInt(idx)+1)+'_mark_error').removeAttr('style');
                plot.svgDoc.find('.draw_outline_base[ouid="'+idx+'"]').addClass('draw_outline_mark_error draw_'+(parseInt(idx)+1)+'_outline_mark_error');
            } else if(res.todo == res.done && res.todo > 0 && res.touched) {
                //mark correct
                plot.svgDoc.find('.is_plot[uid="'+idx+'"]').addClass('draw_mark_correct draw_'+(parseInt(idx)+1)+'_mark_correct').removeAttr('style');
                plot.svgDoc.find('.draw_outline_base[ouid="'+idx+'"]').addClass('draw_outline_mark_correct draw_'+(parseInt(idx)+1)+'_outline_mark_correct');
            }
        });

        if(plot.points.length > 0) {
            $.each(plot.points, function(idx, val) {
                res = presenter.grepPoints(plot.selectedPoints, val);
                if(val.notScored === false) {
                    if(!val.correct && res && val.touched) {
                        //mark wrong
                        presenter.markPointAsError(val.x, val.y);
                    } else if(val.correct && res && val.touched) {
                        //mark correct
                        presenter.markPointAsCorrect(val.x, val.y);
                    }
                }
            });

            //check excess points
            $.each(plot.selectedPoints, function(idx, val) {
                res = presenter.grepPoints(plot.points, val);
                if(!res) {
                    presenter.markPointAsError(val.x, val.y);
                }
            });
        }
    };

    presenter.getMaxScore = function(){
        if(!presenter.isActivity) {
            return 0;
        }

        var todo = 0;

        $.each(plot.expressions, function(idx, val) {
            //include selectable plots
            if(val.selectable && val.correctAnswer) {
                todo++;
            }
            //include expected variables
            var res = plot.plotVariablesResult(idx);
            if(res.todo > 0) {
                todo++;
            }
        });
        //include all scorable points
        $.each(plot.points, function(idx, val) {
            if(val.notScored === false) {
                todo++;
            }
        })

        return todo;
    }

    presenter.getScore = function(){
        if(!presenter.isActivity) {
            return 0;
        }

        var done = 0;
        var res;

        $.each(plot.expressions, function(idx, val) {
            if(val.selectable && val.correctAnswer == val.selected && val.correctAnswer) {
                done++;
            }
            //get variables score
            res = plot.plotVariablesResult(idx);
            if(res.todo > 0 && res.todo == res.done) {
                done++;
            }
        });

        $.each(plot.points, function(idx, val) {
            res = presenter.grepPoints(plot.selectedPoints, val);
            if(((val.correct && res) || (!val.correct && !res)) && val.notScored === false) {
                done++;
            }
        })

        return done;
    }

    presenter.grepPoints = function(arr, point) {
        var res = false;
        $.each(arr, function(idx, el) {
            if(el.x == point.x && el.y == point.y) {
                res = true;
                return;
            }
        });

        return res;
    }

    presenter.getErrorCount = function(){
        if(!presenter.isActivity) {
            return 0;
        }

        var errors = 0;
        var res;
        $.each(plot.expressions, function(idx, val) {
            if(val.selectable && val.correctAnswer == false && val.selected == true && val.touched) {
                errors++;
            }
            //check variables
            res = plot.plotVariablesResult(idx);
            if(res.todo != res.done && res.touched) {
                errors++;
            }
        })

        //check points
        if(plot.points.length > 0) {
            $.each(plot.points, function(idx, val) {
                res = presenter.grepPoints(plot.selectedPoints, val);
                //var res = $.grep(plot.selectedPoints, function(e){ return e.x == plot.points[p].x && e.y == plot.points[p].y; });
                if(!val.correct && res && val.touched && val.notScored === false) {
                    errors++;
                }
            })

            $.each(plot.selectedPoints, function(idx, val) {
                res = presenter.grepPoints(plot.points, val);
                //var res = $.grep(plot.points, function(e){ return e.x == plot.selectedPoints[p].x && e.y == plot.selectedPoints[p].y; });
                if(!res) {
                    errors++;
                }
            });
        }

        return errors;
    }

    presenter.reset = function(){
        presenter.errorsMode = false;
        presenter._allDoneState = false;
        $.each(plot.expressions, function(idx, val) {
            val.touched = false;
            val.cssColor = val.cssColorInitialValue;
            val.visible = val.initVisible;
            $.each(val.variables, function(vidx, variableObj) {
                variableObj.touched = false;
                variableObj.value = variableObj.initialValue;
            })
        });

        $.each(plot.points, function(idx, val) {
            val.touched = false;
        })
        plot.reset();
        presenter.isVisible = presenter.initIsVisible;
        presenter.updateVisibility();
    }

    presenter.run = function(view, model){
        presenter.errorsMode = false;
        presenter.view = view;
        presenter.model = model;
        presenter._allDoneState = false;

        addonID = model.ID;

        presenter.initialize(presenter.view, presenter.model, true);
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.updateVisibility = function() {
        if(presenter.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    }
    presenter.initialize = function(view, model, interactive) {
        var v, p, el;
        this._model = model;
        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        presenter.decimalSeparator = (model['Decimal separator'] === undefined || model['Decimal separator'] == '') ? '.' : model['Decimal separator'];
        if(presenter.decimalSeparator != '.' && presenter.decimalSeparator != ',') {
            presenter.decimalSeparator = '.';
        };
        presenter.updateVisibility();
        plot.interactive = interactive;
        plot.width = parseInt(model['Width']);
        plot.height = parseInt(model['Height']);
        plot.xMin = (model['xMin'] == '' && model['xMin'] != '0' ? -10 : parseFloat(this.toDotSeparator(model['xMin'])));
        plot.xMax = (model['xMax'] == '' && model['xMax'] != '0' ? 10 : parseFloat(this.toDotSeparator(model['xMax'])));
        plot.yMin = (model['yMin'] == '' && model['yMin'] != '0' ? -10 : parseFloat(this.toDotSeparator(model['yMin'])));
        plot.yMax = (model['yMax'] == '' && model['yMax'] != '0' ? 10 : parseFloat(this.toDotSeparator(model['yMax'])));
        plot.initXMin = plot.xMin;
        plot.initXMax = plot.xMax;
        plot.initYMin = plot.yMin;
        plot.initYMax = plot.yMax;
        plot.grid = model['Grid'].toLowerCase() === 'true' ? true : false;
        plot.gridStepX = Math.abs(parseFloat(this.toDotSeparator(model['GridStepX']))) || 1;
        plot.gridStepY = Math.abs(parseFloat(this.toDotSeparator(model['GridStepY']))) || 1;
        plot.arrowheadSize = parseInt(model['Arrowhead size']) || 6;
        plot.asymptoteMinimumDY = this.toDotSeparator(model['Asymptote DY']) || 5;
        plot.axisValues = model['Axis values'].toLowerCase() === 'true' ? true : false;
        plot.xAxisDescription = model['X axis description'] || 'x';
        plot.yAxisDescription = model['Y axis description'] || 'y';
        plot.xAxisVisible = model['hide X axis'] === undefined || model['hide X axis'].toLowerCase() === 'false' || model['hide X axis'] == '' ? true : false;
        plot.yAxisVisible = model['hide Y axis'] === undefined || model['hide Y axis'].toLowerCase() === 'false' || model['hide Y axis'] == '' ? true : false;
        var xAxisValues = model['Axis x values'] === undefined || model['Axis x values'] == '' || this._hasIllegalCharacters(model['Axis x values'].toString()) ? false : model['Axis x values'].toString().split(this.getSeparatorByDecimalSeparator());
        var yAxisValues = model['Axis y values'] === undefined || model['Axis y values'] == '' || this._hasIllegalCharacters(model['Axis y values'].toString()) ? false : model['Axis y values'].toString().split(this.getSeparatorByDecimalSeparator());
        if(xAxisValues !== false && xAxisValues.length > 0) {
            $.each(xAxisValues, function(idx, val) {
                if(val.toString().match(/\*/) !== null) {
                    plot.xAxisCyclicValues.push(presenter.toDotSeparator(parseInt(val)));
                } else {
                    plot.xAxisCustomValues.push(parseFloat(presenter.toDotSeparator(val)));
                }
            });
        }
        if(yAxisValues !== false && yAxisValues.length > 0) {
            $.each(yAxisValues, function(idx, val) {
                if(val.toString().match(/\*/) !== null) {
                    plot.yAxisCyclicValues.push(presenter.toDotSeparator(parseInt(val)));
                } else {
                    plot.yAxisCustomValues.push(parseFloat(presenter.toDotSeparator(val)));
                }
            });
        }
        plot.expressions = new Array();
        plot.pointActiveArea = parseInt(this.toDotSeparator(model['Point active area size'])) || 10;
        plot.pointRadius = parseInt(this.toDotSeparator(model['Point radius'])) || 3;
        plot.pointOutlineRadius = parseInt(this.toDotSeparator(model['Point outline radius'])) || 7;

        for (p in model['Expressions']) {
            if(model['Expressions'][p]['expression'] != '') {
                el = {
                    id: model['Expressions'][p]['id'] === undefined || model['Expressions'][p]['id'] == '' ? p : model['Expressions'][p]['id'],
                    expression: this.toDotSeparator(model['Expressions'][p]['expression']),
                    selectable: model['Expressions'][p]['selectable'].toLowerCase() === 'true' ? true : false,
                    selected: false,
                    correctAnswer: model['Expressions'][p]['correct'].toLowerCase() === 'true' ? true : false,
                    xMin: model['Expressions'][p]['xMin'] === undefined || (model['Expressions'][p]['xMin'] == '' && model['Expressions'][p]['xMin'] != '0') ? false : this.toDotSeparator(model['Expressions'][p]['xMin']),
                    xMax: model['Expressions'][p]['xMax'] === undefined || (model['Expressions'][p]['xMax'] == '' && model['Expressions'][p]['xMax'] != '0') ? false : this.toDotSeparator(model['Expressions'][p]['xMax']),
                    yMin: model['Expressions'][p]['yMin'] === undefined || (model['Expressions'][p]['yMin'] == '' && model['Expressions'][p]['yMin'] != '0') ? false : this.toDotSeparator(model['Expressions'][p]['yMin']),
                    yMax: model['Expressions'][p]['yMax'] === undefined || (model['Expressions'][p]['yMax'] == '' && model['Expressions'][p]['yMax'] != '0') ? false : this.toDotSeparator(model['Expressions'][p]['yMax']),
                    variables: {},
                    initVisible: model['Expressions'][p]['hidden'] !== undefined && model['Expressions'][p]['hidden'] != '' && model['Expressions'][p]['hidden'].toLowerCase() === 'true' ? false : true,
                    type: model['Expressions'][p]['y to x'] === undefined || model['Expressions'][p]['y to x'] == '' || model['Expressions'][p]['y to x'].toLowerCase() === 'false' ? plot.TYPE_X_TO_Y : plot.TYPE_Y_TO_X,
                    touched: false,
                    cssColorInitialValue: model['Expressions'][p]['color'] === undefined || model['Expressions'][p]['color'] == '' ? '' : model['Expressions'][p]['color']
                };
                el.cssColor = el.cssColorInitialValue;
                el.visible = el.initVisible;
                plot.expressions.push(el);
            }
        }
        for(v in model['Variables']) {
            var plotId = model['Variables'][v]['plot id'];
            var variable = model['Variables'][v]['variable'];
            var variableValue = this.toDotSeparator(model['Variables'][v]['value']);
            var expectedValue = model['Variables'][v]['expected'] === undefined || (model['Variables'][v]['expected'] == '' && model['Variables'][v]['expected'] != '0') ? null : this.toDotSeparator(model['Variables'][v]['expected']);

            if(plotId != '' && variable != '') {
                for (var ex in plot.expressions) {
                    if(plot.expressions[ex].id == plotId) {
                        var iv = variableValue != '' ? parseFloat(variableValue) : 0;
                        el = {
                            initialValue: this.valueToFloat(variableValue),
                            value: this.valueToFloat(variableValue),
                            isExercise: expectedValue ? true : false,
                            expectedValue: parseFloat(expectedValue),
                            touched: false
                        };
                        plot.expressions[ex].variables[variable] = el;
                    }
                }
            }
        }

        plot.points = new Array();
        for (p in model['Points']) {
            if((model['Points'][p]['x value'] == '0' || model['Points'][p]['y value'] == '0') || (model['Points'][p]['x value'] != '' && model['Points'][p]['y value'] != '')) {
                var point = {
                    x: this.toDotSeparator(model['Points'][p]['x value']),
                    y: this.toDotSeparator(model['Points'][p]['y value']),
                    initiallySelected: model['Points'][p]['selected'] === undefined || model['Points'][p]['selected'].toLowerCase() === 'false' ? false : true,
                    correct: model['Points'][p]['correct'] === undefined || model['Points'][p]['correct'].toLowerCase() === 'true' ? true : false,
                    touched: false,
                    notScored: model['Points'][p]['not scored'] === undefined || model['Points'][p]['not scored'].toLowerCase() === 'false' || model['Points'][p]['not scored'] == '' ? false : true,
                    clickable: true
                }
                //if we don't want that point in score make it non-clickable
                if(point.notScored) {
                    point.clickable = false;
                }
                plot.points.push(point);
                if(point.initiallySelected) {
                    plot.selectedPoints.push({
                        x: point.x,
                        y: point.y,
                        clickable: point.clickable
                    });
                }
            }
        }
        plot.maxSelectedPoints = model['Max selected points'] === undefined || model['Max selected points'] == '' || model['Max selected points'] == 0 ? 0 : parseInt(model['Max selected points']);
        presenter.isActivity = model['Not activity'] !== undefined && model['Not activity'] != '' && model['Not activity'].toLowerCase() === 'true' ? false : true;
        plot.isActivity = presenter.isActivity;
        plot.freePoints = model['Free points'] !== undefined && model['Free points'] != '' && model['Free points'].toLowerCase() === 'true' ? true : false;

        presenter.broadcast = [];
        if(model['Broadcast'] !== '' && model['Broadcast'] !== undefined) {
            var broadcasts = model['Broadcast'].split(',');
            $.each(broadcasts, function(idx, val) {
                presenter.broadcast.push(val.trim());
            });
        }
        plot.stateChanged = presenter.stateChanged;
        plot.convertValueToDisplay = presenter.convertValueToDisplay;
        plot.calculatePrecision();

        $(view).find('.canvas:first').svg({
            onLoad: presenter.onSvgCreate,
            settings: {
                width: '100%',
                height: '100%',
                preserveAspectRatio: "none"
            }
        });
    };
    presenter.toDotSeparator = function(value) {
        return (value + '').replace(this.decimalSeparator, '.');
    };
    presenter.getSeparatorByDecimalSeparator = function() {
        return this.decimalSeparator == '.' ? ',' : ';';
    };
    presenter.convertValueToDisplay = function(value) {
        //set correct decimal separator
        value = presenter.replaceDecimalSeparator(value);
        //change minus to en dash
        value = value.replace(new RegExp('\-', 'g'), '\u2013');
        return value;
    };
    presenter.replaceDecimalSeparator = function(value) {
        return (value + '').replace(new RegExp('\\.', 'g'), presenter.decimalSeparator);
    };
    presenter.getDecimalSeparator = function() {
        return presenter.decimalSeparator;
    };
    presenter.valueToFloat = function(val) {
        if(val === '' || val === undefined || !this.isCorrectDecimal(val)) {
            return Number.NaN;
        }
         val = this.toDotSeparator(val);
         return parseFloat(val);
    };
    presenter._hasIllegalCharacters = function(word) {
        var tmpWord;
        if(this.decimalSeparator == ',') {
            //use ';' for ',' seprator
            tmpWord = word.replace(/[^\*0-9;,-]/g, '');
        } else {
            //use ',' for '.' separator
            tmpWord = word.replace(/[^\*0-9,.-]/g, '');
        }
        return tmpWord != word;
    };
    presenter.isCorrectDecimal = function(nmb) {
        if (nmb === null ||
                ModelValidationUtils.isStringEmpty(nmb) ||
                (this.getDecimalSeparator() === ',' && nmb.toString().indexOf('.') !== -1) ||
                (this.getDecimalSeparator() === '.' && nmb.toString().indexOf(',') !== -1)) {
            return false;
        }

        return true;
    };
    presenter.createPreview = function(view, model) {
        presenter.errorsMode = false;
        presenter.view = view;
        presenter.model = model;
        presenter.initialize(presenter.view, presenter.model, false);
    };

    presenter.onSvgCreate = function(svg) {
        plot.svg = svg;
        plot.svgDoc = $(plot.svg._svg);
        var plotScale = plot.svg.group({
            class_:'scale',
            transform:''
        });
        var plotTranslate = plot.svg.group(plotScale, {
            class_:'translate',
            transform:''
        });
        var plotOverall = plot.svg.group(plotTranslate, {
            class_:'overall'
        });
        plot.svg.group(plotOverall, {
            class_:'grid'
        });
        plot.svg.group(plotOverall, {
            class_:'axis'
        });
        plot.svg.group(plotOverall, {
            class_:'drawings'
        });
        plot.svg.group(plotOverall, {
            class_:'points'
        });
        plot.svg.group(plotOverall, {
            class_:'drawingsAreas'
        });
        plot.svg.group(plotOverall, {
            class_:'pointsAreas'
        });
        plot.setScale();
        plot.setStep();
        plot.translate();
        plot.draw();
        if(!presenter.isVisible) {
            presenter.hide();
        }
    }

    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'zoomIn'.toLowerCase():
                plot.zoom(1);
                break;
            case 'zoomOut'.toLowerCase():
                plot.zoom(-1);
                break;
            case 'moveLeft'.toLowerCase():
                plot.move(parseInt(this.toDotSeparator(params)),0);
                break;
            case 'moveRight'.toLowerCase():
                plot.move(parseInt(this.toDotSeparator(params))*(-1),0);
                break;
            case 'moveDown'.toLowerCase():
                plot.move(0, parseInt(this.toDotSeparator(params)));
                break;
            case 'moveUp'.toLowerCase():
                plot.move(0, parseInt(this.toDotSeparator(params))*(-1));
                break;
            case 'getState'.toLowerCase():
                return this.getState();
                break;
            case 'setState'.toLowerCase():
                this.setState(params);
                break;
            case 'setVariable'.toLowerCase():
                plot.setVariable(params[0], params[1], presenter.valueToFloat(params[2]));
                break;
            case 'setVisible'.toLowerCase():
                plot.setVisible(params[0], parseInt(params[1]) == 1 ? true : false);
                break;
            case 'setPointVisibility'.toLowerCase():
                plot.setPointVisibility(this.toDotSeparator(params[0]), this.toDotSeparator(params[1]), parseInt(params[2]) == 1 ? true : false);
                break;
            case 'setPlotStyle'.toLowerCase():
                plot.setPlotStyle(params[0], params[1], params[2], params[3]);
                break;
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'restoreView'.toLowerCase():
                plot.restoreInitialViewPort();
                break;
        }
        if(presenter.errorsMode) {
            presenter.setShowErrorsMode();
        }
    };
    presenter.enableUI = function(state) {
        plot.enableUI(state);
    };
    presenter.hide = function() {
        presenter.isVisible = false;
        presenter.setVisibility(false);
    };
    presenter.show = function() {
        presenter.isVisible = true;
        presenter.setVisibility(true);
    };
    presenter.setVisibility = function(isVisible) {
        $(presenter.view).css("visibility", isVisible ? "visible" : "hidden");
    };
    presenter.getState = function() {
        var plotState = [];
        var variableState = [];
        var pointsState = [];

        $.each(plot.expressions, function(idx, val) {
            plotState[idx] = {
                selected: val.selected,
                touched: val.touched,
                visible: val.visible
            }
            //old state
            //plotState[p] = val.selected;

            $.each(val.variables, function(vidx, variableObj) {
                variableState.push({
                    plotId: val.id,
                    variable: vidx,
                    value: variableObj.value,
                    touched: variableObj.touched
                });
            });
        })

        $.each(plot.points, function(idx, val) {
            pointsState[idx] = {
                touched: val.touched
            }
        });

        var state = JSON.stringify({
            version: 2,
            plots:plotState,
            variables: variableState,
            selectedPoints:plot.selectedPoints,
            points: pointsState,
            isVisible: presenter.isVisible
            });
        return state;
    }

    presenter.setState = function(state) {
        if(state != '' && state !== undefined) {
            state = JSON.parse(state);
            //old state
            if(state.version == undefined) {
                if(state.plots.length > 0) {
                    $.each(state.plots, function(idx, val) {
                        plot.expressions[idx].touched = true;
                        plot.expressions[idx].selected = val;

                    });
                    plot.selectedPoints = state.points;
                }
            } else {
                if(state.plots.length > 0) {
                    $.each(state.plots, function(idx, val) {
                        plot.expressions[idx].selected = val.selected;
                        plot.expressions[idx].touched = val.touched;
                        plot.expressions[idx].visible = val.visible != undefined ? val.visible : true;
                    });
                }
                //restore variables
                if(state.variables.length > 0) {
                    $.each(state.variables, function(sidx, sval) {
                        $.each(plot.expressions, function(pidx, pval) {
                            if(sval.plotId == pval.id) {
                                pval.variables[sval.variable].value = presenter.valueToFloat(sval.value);
                                pval.variables[sval.variable].touched = sval.touched;
                            }
                        });
                    });
                }
                $.each(state.points, function(idx, val) {
                    plot.points[idx].touched = val.touched
                })
                plot.selectedPoints = [];
                $.each(state.selectedPoints, function(k, v) {
                    plot.selectedPoints.push(
                        {
                            x: v.x,
                            y: v.y,
                            clickable: v.clickable != undefined ? v.clickable : true
                        }
                    )
                });
                if(state.isVisible === false) {
                    presenter.hide();
                } else {
                    presenter.show();
                }
            }

            plot.draw();
        }
    }

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };
    presenter.stateChanged = function(data) {
        var receiver;
        if(data) {
            //chained events when data is array
            if(!(data instanceof Array)) {
                //become chain with single event
                data = [data];
            }

            //call chained events
            for(var t=0;t<data.length;t++) {
                data[t].source = addonID;
                data[t].item = data[t].item.toString();
                if(data[t].item.substring(0,6) == 'point_') {
                    data[t].item = presenter.replaceDecimalSeparator(data[t].item);
                }
                data[t].value = data[t].value.toString();
                data[t].score = data[t].score === null ? null : data[t].score.toString();
                //broadcast events or send event to bus
                if(presenter.broadcast.length > 0) {
                    $.each(presenter.broadcast, function(idx, broadcastTo) {
                        receiver = presenter.playerController.getModule(broadcastTo);
                        if(receiver) {
                            receiver.onEvent('ValueChanged', data[t]);
                        }
                    });
                } else {
                    presenter.eventBus.sendEvent('ValueChanged', data[t]);
                }
            }
        }

        if(presenter.broadcast.length === 0) {
            if(presenter.isActivity && presenter.isAllOK()) {
                if(!presenter._allDoneState) {
                    presenter._allDoneState = true;
                    sendAllOKEvent();
                }
            } else {
                presenter._allDoneState = false;
            }
        }
    };

    function sendAllOKEvent () {
        var eventData = {
            'source': addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.getPlot = function() {
        return plot;
    }

    return presenter;
}
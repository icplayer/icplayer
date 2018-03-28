import { ShowingManager } from './manager.jsm';
/**
 * @typedef {{width: Number, height: Number}|{}} ViewerConfig
 */


export class Viewer {

    manager = null;
    elementsCount = 0;
    /**
     * @type {HTMLDivElement}
     */
    container = null;
    /**
     * @type {ViewerConfig}
     */
    config = {};
    imagesWrapper = document.createElement("div");
    imagesScroller = document.createElement("div");
    images = [];

    //Animator
    timeoutID = null;
    actualPosition = -1;
    nextPosition = 0;
    hammertime = null;
    actualScale = 1.0;

    leftMove = 0;
    topMove = 0;
    scroll = 0;
    maxScroll = document.body.offsetHeight - window.innerHeight;


    /**
     * @param {HTMLDivElement} container
     * @param  {{imageElement: string}[]} imagesList
     * @param {ViewerConfig} config
     */
    constructor (container, imagesList, config) {
        this.elementsCount = imagesList.length;
        this.container = container;
        this.config = config;
        this.__build_view();

        this.manager = new ShowingManager(imagesList, this.images);
        this.__connect_handlers();
        this.__actualize_scale();
        this.__actualize_view();
    }

    next () {
        if (this.actualScale !== 1) {
            return;
        }

        this.topMove = 0;
        this.leftMove = 0;
        this.scroll = 0;

        this.manager.next();
        this.nextPosition -= this.config.width;
        this.nextPosition = Math.max(this.nextPosition, this.elementsCount * this.config.width * -1);
        this.__actualize_view();
    }

    previous () {
        if (this.actualScale !== 1) {
            return;
        }

        this.topMove = 0;
        this.leftMove = 0;
        this.scroll = 0;

        this.manager.previous();
        this.nextPosition += this.config.width;
        this.nextPosition = Math.min(this.nextPosition, 0);
        this.__actualize_view();

    }

    __connect_handlers () {
        this.hammertime = new Hammer(this.container);
        this.hammertime.get('swipe').set({enable: true, direction: Hammer.DIRECTION_ALL});
        this.hammertime.get('pinch').set({ enable: true });
        this.hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL, threshold: 0});

        let self = this;
        this.hammertime.on('swiperight', function () {
            self.previous();
        });

        this.hammertime.on('swipeleft', function () {
            self.next();
        });

        this.hammertime.on('tap', function (ev) {
            let x = ev.center.x - self.container.getBoundingClientRect().left;

            if (x < self.config.width / 2) {
                self.previous();
            } else {
                self.next();
            }
        });

        this.hammertime.on('pinchout', function (ev) {
            if (self.actualScale < 2) {
                self.actualScale += 0.02;
                self.__actualize_scale();
                self.scroll = 0;
            }
        });

        this.hammertime.on('pinchin', function (ev) {
            if (self.actualScale > 1) {
                self.actualScale -= 0.02;
                self.__actualize_scale();
                self.scroll = 0;
            }
        });

        let lastPoint = {
            x: null,
            y: null
        };

        this.hammertime.on('panstart', function (ev) {
            lastPoint.x = ev.deltaX;
            lastPoint.y = ev.deltaY;
        });

        this.hammertime.on('panmove', function (ev) {
            let diffX = ev.deltaX - lastPoint.x;
            let diffY = ev.deltaY - lastPoint.y;
            lastPoint.x = ev.deltaX;
            lastPoint.y = ev.deltaY;

            self.__moveUp(diffY);
            self.__moveLeft(diffX);

            self.__actualize_view();
        });

        this.hammertime.on('panend', function (ev) {
           lastPoint.x = 0;
            lastPoint.y = 0;
        });
    }

    __moveUp(direction) {
        console.log("-------------------");
        console.log("DIRECTION", direction, this.scroll, this.maxScroll);

        this.scroll += direction * -1;
        direction = 0;

        if (this.scroll < 0) {
            direction = this.scroll * -1;
            this.scroll = 0;
        }

        if (this.scroll >= this.maxScroll) {
            direction = (this.scroll - this.maxScroll) * -1;
            this.scroll = this.maxScroll;
        }

        this.topMove += direction;
    }

    __moveLeft (direction) {
        this.leftMove += direction;
    }

    __actualize_scale () {
        this.hammertime.get('swipe').set({enable: this.actualScale === 1});

        this.container.style.webkitTransform = "scale(" + this.actualScale + ") translateZ(0)";
        this.container.style.transform = "scale(" + this.actualScale + ") translateZ(0)";
        this.container.style.msTransform = "scale(" + this.actualScale + ") translateZ(0)";
        this.__actualize_view();
    }

    __build_view () {
        for (let i = 0; i < this.elementsCount; i++) {
            let element = document.createElement("div");
            element.classList.add("imageElement");
            element.style.width = this.config.width + "px";
            element.style.height = this.config.height + "px";

            this.imagesScroller.appendChild(element);
            this.images.push(element);
        }

        this.imagesScroller.classList.add("imagesScroller");
        this.imagesWrapper.appendChild(this.imagesScroller);
        this.imagesWrapper.classList.add("imagesWrapper");
        this.imagesWrapper.style.width = (this.elementsCount * this.config.width) + "px";
        this.imagesWrapper.style.height = this.config.height + "px";
        this.container.appendChild(this.imagesWrapper);
    }

    __actualize_view () {
        this.actualPosition = this.nextPosition;

        let maxLeft = (this.config.width * (this.actualScale - 1)) / 4;
        let maxTop = (this.config.height * (this.actualScale - 1)) / 4;

        let left = this.leftMove;
        let top = this.topMove;

        left = Math.min(left, maxLeft);
        left = Math.max(left, -maxLeft);

        top = Math.min(top, maxTop);
        top = Math.max(top, -maxTop);

        this.leftMove = left;
        this.topMove = top;

        this.imagesScroller.style.top = top + 'px';
        this.imagesScroller.style.left = left + 'px';

        window.scroll(0, this.scroll);

        this.imagesWrapper.style.left = this.actualPosition + "px";
    }
}
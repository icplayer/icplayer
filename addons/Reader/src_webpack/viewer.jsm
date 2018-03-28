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
    images = [];

    //Animator
    timeoutID = null;
    actualPosition = 0;
    nextPosition = 0;


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
        this.__actualize_view();
    }

    next () {
        this.manager.next();
        this.nextPosition -= this.config.width;
        this.nextPosition = Math.max(this.nextPosition, this.elementsCount * this.config.width * -1);
    }

    previous () {
        this.manager.previous();
        this.nextPosition += this.config.width;
        this.nextPosition = Math.min(this.nextPosition, 0);

    }

    __build_view () {
        for (let i = 0; i < this.elementsCount; i++) {
            let element = document.createElement("div");
            element.classList.add("imageElement");
            element.style.width = this.config.width + "px";
            element.style.height = this.config.height + "px";

            this.imagesWrapper.appendChild(element);
            this.images.push(element);
        }

        this.imagesWrapper.classList.add("imagesWrapper");
        this.imagesWrapper.style.width = (this.elementsCount * this.config.width) + "px";
        this.imagesWrapper.style.height = this.config.height + "px";
        this.container.appendChild(this.imagesWrapper);
    }

    __actualize_view () {
        if (this.actualPosition === this.nextPosition) {
            this.timeoutID = setTimeout(this.__actualize_view.bind(this), 100);
            return;
        }

        this.actualPosition = this.nextPosition;
        this.imagesWrapper.style.left = this.actualPosition + "px";

        this.timeoutID = setTimeout(this.__actualize_view.bind(this), 17);

    }
}
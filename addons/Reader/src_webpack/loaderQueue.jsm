export class LoaderQueue {
    elements = {};
    isLoadedOrLoadingElements = {};
    /**
     * @type {{id: Number, url: string}[]} toLoadQueue
     */
    toLoadQueue = [];
    MAX_ELEMENTS_TO_LOAD = 2;
    whileLoadingElements = 0;

    /**
     * Add as last element to queue image
     * @param {{id: Number, url: string}}image
     */
    appendToQueue (image) {
        if (!this.elements[image.id]) {
            let imageWrapper = document.createElement("div");
            imageWrapper.classList.add('image-wrapper');
            this.elements[image.id] = imageWrapper;
        }

        if (!this.isLoadedOrLoadingElements[image.id]) {
            this.toLoadQueue.push(image);
            this.__check_should_load(true);
        }
    }

    /**
     * Remove everything from queue
     */
    clearQueue () {
        this.toLoadQueue = [];
    }

    getElement (id) {
        return this.elements[id];
    }

    __check_should_load () {
        if (this.whileLoadingElements > this.MAX_ELEMENTS_TO_LOAD) {
            return;
        }

        if (this.toLoadQueue.length === 0) {
            return;
        }

        let elementToLoad = this.toLoadQueue.shift();
        this.elements[elementToLoad.id].appendChild(this.__create_element(elementToLoad));
        this.whileLoadingElements++;
    }

    __on_load(id) {
        if (this.whileLoadingElements > 0) {
            this.whileLoadingElements--;
        }

        this.__check_should_load();
    }

    /**
     * @param {{id: Number, url: string}}image
     */
    __create_element(image) {
        let imageElement = new Image();
        let self = this;

        this.isLoadedOrLoadingElements[image.id] = true;

        imageElement.onload = function (ev) {
            imageElement.onload = null;
            self.__on_load(image.id);
        };

        imageElement.onerror = function (ev) {
            imageElement.onerror = null;
            imageElement.onload = null;
            self.__on_load(image.id);
        };

        imageElement.src = image.url;
        imageElement.classList.add("image-element");

        return imageElement;
    }
}
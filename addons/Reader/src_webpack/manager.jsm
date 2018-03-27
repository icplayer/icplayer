import { LoaderQueue } from './loaderQueue.jsm';

export class ShowingManager {
    ELEMENTS_ON_LEFT = 5;
    ELEMENTS_ON_RIGHT = 5;
    /**
     * Container for images
     * @type {{id: Number, url: string}[]}
     */
    imagesList = [];
    loaderQueue = null;
    actualElement = 0;

    /**
     * @param {{imageElement: string}[]} imagesList
     * @param {{HTMLDIVElement}[]} imagesWrappers
     */
    constructor (imagesList, imagesWrappers) {
        this.loaderQueue = new LoaderQueue(imagesWrappers);
        this.__buildImagesList(imagesList);
        this.__update_queue();
    }

    /**
     * Get actual visible element
     * @returns {*}
     */
    getActualElement () {
        return this.loaderQueue.getElement(this.actualElement);
    }

    next () {
        if (this.actualElement + 1 < this.imagesList.length) {
            this.actualElement++;
            this.__update_queue();
        }

        this.__garbage();
    }

    previous () {
        if (this.actualElement > 0) {
            this.actualElement--;
            this.__update_queue();
        }

        this.__garbage();
    }

    __update_queue () {
        this.loaderQueue.clearQueue();
        this.loaderQueue.appendToQueue(this.imagesList[this.actualElement]);
        for (let i = 1; i < Math.max(this.ELEMENTS_ON_LEFT, this.ELEMENTS_ON_RIGHT); i++) {
            if (i < this.ELEMENTS_ON_RIGHT && this.actualElement + i < this.imagesList.length) {
                this.loaderQueue.appendToQueue(this.imagesList[this.actualElement + i]);
            }

            if (i < this.ELEMENTS_ON_LEFT && this.actualElement - i > 0) {
                this.loaderQueue.appendToQueue(this.imagesList[this.actualElement - i]);
            }
        }
    }

    /**
     * @param {{imageElement: string}[]} imagesList
     */
    __buildImagesList (imagesList) {
        let list = [];
        imagesList.forEach((el, index) => {
            list.push({
               id: index,
               url: el.imageElement
            });
        });

        this.imagesList = list;
    }

    __garbage () {
        let loadedElements = this.loaderQueue.getLoadedElements();

        if (loadedElements > 15) {
            for (let i = 0; i < this.imagesList.length; i++) {
                if (i > this.actualElement - this.ELEMENTS_ON_LEFT && i < this.actualElement + this.ELEMENTS_ON_RIGHT) {
                    continue;
                }

                this.loaderQueue.remove(i);
            }
        }
    }


}
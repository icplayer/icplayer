import {Loader} from "./Loader";

export class VideoLoader extends Loader{

    constructor($view) {
        super($view);
    }

    show(){
        this.$view.addClass("video-loader");
    }

    hide(){
        this.$view.removeClass("video-loader");
    }
}
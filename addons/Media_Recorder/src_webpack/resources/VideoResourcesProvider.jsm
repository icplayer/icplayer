import {ResourcesProvider} from "./ResourcesProider.jsm";

export class VideoResourcesProvider extends ResourcesProvider {

    _getOptions() {
        return {
            audio: true,
            video: true
        }
    }
}
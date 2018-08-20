import {AudioResourcesProvider} from "./AudioResourcesProvider.jsm";
import {VideoResourcesProvider} from "./VideoResourcesProvider.jsm";
import {SupportedTypes} from "../confiuration/SupportedTypes.jsm";
import {Errors} from "../validation/Errors.jsm";

export class ResourcesProviderFactory {

    static create({$view, type}) {
        switch (type) {
            case SupportedTypes.AUDIO:
                return new AudioResourcesProvider($view);
            case SupportedTypes.VIDEO:
                return new VideoResourcesProvider($view);
            default:
                throw Error(Errors.type_EV01);
        }
    }
}
package com.lorepo.icplayer.client.model.asset;

public class ScriptAsset extends BasicAsset {
    private boolean isModule = false;

    public ScriptAsset(String url){
        super("script", url);
    }

    public ScriptAsset(String url, boolean isModule) {
        super(isModule ? "module-script" : "script", url);
        this.isModule = isModule;
    }

    public boolean isModule() {
        return isModule;
    }
}

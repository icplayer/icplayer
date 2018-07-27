package com.lorepo.icplayer.client.content.services;

import java.util.List;

import com.google.gwt.http.client.*;
import com.lorepo.icplayer.client.model.IAsset;
import com.lorepo.icplayer.client.module.api.player.IAssetsService;
import com.lorepo.icplayer.client.module.api.player.IContent;
import com.lorepo.icplayer.client.utils.UuidGenerator;

public class AssetsService implements IAssetsService {

    private final List<IAsset> assets;

    public AssetsService(IContent content) {
        assets = content.getAssets();
    }

    @Override
    public String getContentType(String href) {

        String contentType = "";

        for (IAsset asset : assets) {
            if (asset.getHref().equals(href)) {
                contentType = asset.getContentType();
            }
        }

        return contentType;
    }

    @Override
    public void storeAsset(Object asset, Object callback) {
        initBlobUploadUrl(asset, callback);
    }

    private void initBlobUploadUrl(final Object asset, final Object callback) {
        RequestBuilder builder = new RequestBuilder(RequestBuilder.GET, URL.encode("/editor/api/blobUploadDir"));

        try {
            builder.sendRequest("", new RequestCallback() {

                @Override
                public void onResponseReceived(Request request, Response response) {
                    if (response.getStatusCode() == 200) {
                        String url = response.getText().replace("http://localhost:8080", "");
                        String fileName = UuidGenerator.generateRandomUuid();

                        uploadAsset(asset, url, fileName, callback);
                    }
                }

                @Override
                public void onError(Request request, Throwable exception) {
                }
            });
        } catch (RequestException e) {
        }
    }

    public native static void uploadAsset(Object asset, String url, String fileName, Object callback) /*-{
        var form = new FormData();
        form.append('file', asset, fileName);

        var request = new XMLHttpRequest();
        request.open("POST", url);

        request.onreadystatechange = function () {
            callback(request.responseText);
        };

        request.send(form);
    }-*/;
}

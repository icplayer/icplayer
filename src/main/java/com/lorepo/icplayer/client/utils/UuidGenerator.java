package com.lorepo.icplayer.client.utils;

public class UuidGenerator {

    public static native String generateRandomUuid() /*-{
        function generateGroup() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

		return generateGroup() + generateGroup() + '-'
            + generateGroup() + '-'
            + generateGroup() + '-'
            + generateGroup() + '-'
            + generateGroup() + generateGroup() + generateGroup();
	}-*/;
}

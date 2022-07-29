package com.lorepo.icplayer.client.model;

public class OutstretchPageHeight {
    private int y;                      //starting stretch point
    private int height;                 //value of stretching
    private boolean dontMoveModules;    //should move elements

    public OutstretchPageHeight(int y, int height, boolean dontMoveModules) {
        this.y = y;
        this.height = height;
        this.dontMoveModules = dontMoveModules;
    }

    public int getStartingStretchPoint() {
        return y;
    }

    public int getValueOfStretching() {
        return height;
    }

    public boolean shouldMoveModels() {
        return dontMoveModules;
    }
}

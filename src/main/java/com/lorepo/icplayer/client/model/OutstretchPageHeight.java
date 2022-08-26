package com.lorepo.icplayer.client.model;

public class OutstretchPageHeight {
    private int y;                      // starting stretch point
    private int height;                 // value of stretching
    private boolean dontMoveModules;    // should move elements
    private boolean on;                 // is active

    public OutstretchPageHeight(int y, int height, boolean dontMoveModules, boolean isOn) {
        this.y = y;
        this.height = height;
        this.dontMoveModules = dontMoveModules;
        this.on = isOn;
    }

    public int getStartingStretchPoint() {
        return this.y;
    }

    public int getValueOfStretching() {
        return this.height;
    }

    public boolean shouldMoveModels() {
        return this.dontMoveModules;
    }

    public boolean isOn() {
        return this.on;
    }

    public boolean isOff() {
        return !this.on;
    }

    public void setOn() {
        this.on = true;
    }

    public void setOff() {
        this.on = false;
    }
}

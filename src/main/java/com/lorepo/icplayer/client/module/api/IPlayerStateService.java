package com.lorepo.icplayer.client.module.api;

public interface IPlayerStateService {
    boolean isCheckErrorsMode();
    boolean isShowAnswersMode();
    boolean isLimitedShowAnswersMode();
    boolean isLimitedCheckAnswersMode();
    boolean isGradualShowAnswersMode();
    boolean isWorkMode();
    boolean isGradualShowAnswersModeBeforeCheck();
    void setCheckErrorsMode(boolean value);
    void setShowAnswersMode(boolean value);
    void setLimitedShowAnswersMode(boolean value);
    void setLimitedCheckAnswersMode(boolean value);
    void setGradualShowAnswersMode(boolean value);
    void setWorkMode();
    void switchOffModes();
}

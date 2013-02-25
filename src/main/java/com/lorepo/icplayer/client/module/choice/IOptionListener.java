package com.lorepo.icplayer.client.module.choice;

import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;

public interface IOptionListener {

	public void onValueChange(IOptionDisplay option, boolean selected);
}

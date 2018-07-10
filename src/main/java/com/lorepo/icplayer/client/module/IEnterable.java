package com.lorepo.icplayer.client.module;

/*
 * This interface is to be used with module presenters that may or may
 * not require escape button to deactivate before moving to the next module
 * with tab button,depending on their internal state
 */
public interface IEnterable {

	/*
	 * Return true if the module requires escape button to deactivate
	 * before moving to the next module with tab button
	 * false otherwise
	 */
	public boolean isEnterable();
}

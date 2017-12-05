package com.lorepo.icplayer.client;

public class EnableTabindex {
	   private static EnableTabindex instance = null;
	   
	   public boolean isTabindexEnabled = false;
	   
	   protected EnableTabindex() {
	      // Exists only to defeat instantiation.
	   }
	   public static EnableTabindex getInstance() {
	      if(instance == null) {
	         instance = new EnableTabindex();
	      }
	      return instance;
	   }
	   
	   public void create(boolean isTabindexEnabled) {
		   this.isTabindexEnabled = isTabindexEnabled;
	   }
}

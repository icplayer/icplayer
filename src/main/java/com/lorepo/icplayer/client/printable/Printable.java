package com.lorepo.icplayer.client.printable;

public final class Printable {
	
	final public static String NAME_LABEL = "printable_name_label";
	
	public enum PrintableMode {
		NO,
		YES,
		YES_RANDOM
	}
	
	private Printable() {
		// The Printable class is static
	}
	
	public static String getStringValues(PrintableMode mode) {
		if (mode == PrintableMode.NO) {
			return getStringValues(0);
		} else if (mode == PrintableMode.YES) {
			return getStringValues(1);
		} else {
			return getStringValues(2);
		}
	}
	
	public static String getStringValues(int index) {
		if (index == 0){
			return "No";
		} else if (index == 1) {
			return "Don't randomize";
		} else if (index == 2) {
			return "Randomize";
		} else {
			return null;
		}
	}
	
	public static PrintableMode getPrintableModeFromString(String value) {
		if (value.equals("Don't randomize")){
			return PrintableMode.YES;
		} else if (value.equals("Randomize")) {
			return PrintableMode.YES_RANDOM;
		} else {
			return PrintableMode.NO;
		}
	}
}

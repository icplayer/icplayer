package com.lorepo.icplayer.client.module;

public final class Printable {
	
	final public static int NO_INDEX = 0;
	final public static int YES_INDEX = 1;
	final public static int YES_RANDOM_INDEX = 2;
	
	final public static String NAME_LABEL = "printable_name_label";
	final public static String NO_LABEL = "printable_mode_no";
	final public static String YES_LABEL = "printable_mode_yes";
	final public static String YES_RANDOM_LABEL = "printable_mode_yes_random";
	
	public enum PrintableMode {
		NO,
		YES,
		YES_RANDOM
	}
	
	private Printable() {
		// The Printable class is static
	}
	
	public static int toInt(PrintableMode printableMode) {
		if (printableMode == PrintableMode.NO) {
			return NO_INDEX;
		} else if (printableMode == PrintableMode.YES) {
			return YES_INDEX;
		} else {
			return YES_RANDOM_INDEX;
		}
	}
	
	public static PrintableMode getValueFromInt(int value) {
		if (value < 0 || value > 2) {
			throw new IllegalArgumentException("Printable mode int value must be an int in 0-2 range");
		}
		if (value == NO_INDEX) { 
			return PrintableMode.NO;
		} else if (value == YES_INDEX) {
			return PrintableMode.YES;
		} else {
			return PrintableMode.YES_RANDOM;
		}
	}
	
	public static String getStringValues(int index) {
		if (index == 0){
			return "No";
		} else if (index == 1) {
			return "Yes, don't randomize";
		} else if (index == 2) {
			return "Yes, randomize";
		} else {
			return null;
		}
	}
	
	public static PrintableMode getPrintableModeFromString(String value) {
		if (value.equals("Yes, don't randomize")){
			return PrintableMode.YES;
		} else if (value.equals("Yes, randomize")) {
			return PrintableMode.YES_RANDOM;
		} else {
			return PrintableMode.NO;
		}
	}
}

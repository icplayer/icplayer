# Gemini Context: icplayer

This `GEMINI.md` file provides context and instructions for the `icplayer` project, an HTML5 player for interactive lessons.

## Project Overview

*   **Description:** An HTML5 player for interactive lessons, often used in educational software.
*   **Core Technology:** Java using Google Web Toolkit (GWT) 2.4.0.
*   **Addons:** Extensible architecture using JavaScript-based addons, located in `addons/`.
*   **Build System:** Apache Ant is the primary build tool (`build.xml`), with Maven (`pom.xml`) likely used for dependency management or specific tasks. Webpack is used for building JavaScript addons.

## Prerequisites

To build and run this project, the following are required:
*   **Java Development Kit (JDK):** Version compatible with GWT 2.4.0 (likely Java 6, 7, or 8).
*   **Apache Ant:** For running the build scripts.
*   **GWT SDK:** Version 2.4.0 (download and configure path).
*   **Python:** For helper scripts (e.g., `validate_translations_javascript.py`, `tools/build-webpack.py`).
*   **Node.js & npm:** For `addons/` dependencies (Webpack).
*   **Sibling Project:** `icfoundation` (expected to be in a directory `../icfoundation`).

## Setup & Configuration

1.  **Dependencies:** Ensure `icfoundation` is cloned into the parent directory alongside `icplayer`.
2.  **Configuration:**
    *   Copy `build-example.properties` to `build.properties`.
    *   Edit `build.properties` to set the `gwt.sdk` path to your local GWT installation.

## Build Commands (Ant)

*   `ant clean`: Cleans the build directories (`war/WEB-INF/classes`, `war/icplayer`, `gwt-unitCache`).
*   `ant build`: Compiles Java source, bundles libraries, and GWT compiles to JavaScript (production mode).
*   `ant dist`: Creates the distribution package (`dist/icplayer.zip`).
*   `ant devmode`: Runs the GWT Development Mode for testing/debugging.
*   `ant gwtc`: Runs the GWT Compiler.
*   `ant addons`: Copies and processes addon descriptors.
*   `ant validate-translations-javascript`: Validates JSON translations.

## Testing

*   `ant test`: Runs both development and production mode tests.
*   `ant test.dev`: Runs development mode tests (HtmlUnit).
*   `ant test.prod`: Runs production mode tests (HtmlUnit).
*   `ant test.addons`: Runs tests for all addons (uses JsTestDriver).
*   `ant test.single.addon -Daddon.id=AddonName`: Runs tests for a specific addon.
*   `ant test.single.case -Dname=TestCaseName`: Runs a single Java test case.

## Directory Structure

*   `addons/`: Contains source code for player extensions (JavaScript/CSS/XML).
    *   `addons/build.xml`: Ant script for processing addons.
    *   `addons/package.json`: NPM dependencies for addons.
*   `src/`: Main Java source code (`main` and `test`).
*   `war/`: Web application root (standard GWT/Java web app structure).
*   `libs/`: Java JAR dependencies.
*   `tools/`: Build tools (YUI Compressor, etc.).
*   `doc/`: Project documentation.
    *   `doc/compile.md`: Instructions for compiling the player.
*   `build.xml`: Main Ant build script.
*   `pom.xml`: Maven project descriptor.

## Key Files

*   `build.xml`: The master build script.
*   `build-js-addons-compress.xml`: Logic for compressing JS addons.
*   `validate_translations_javascript.py`: Python script for validation.

## Addon: Connection

### Description
The Connection addon allows users to link items from two sets (e.g., Left/Right columns or Top/Bottom rows). It supports single or multiple connections per item, drag-and-drop, click-to-connect, and keyboard navigation.

### Model Rules
*   **Structure:**
    *   `Left column` / `Right column`: Lists of items. Each item has `id`, `content` (HTML), `connects to` (comma-separated IDs of matching items), and `additional class`.
    *   `Columns width`: Defines widths for Left, Middle (canvas), and Right columns (Vertical mode).
    *   `Orientations`: Layout-specific orientation ('Vertical' or 'Horizontal'). Default is Vertical.
    *   `Initial connections`: Pre-defined connections (`from` ID, `to` ID, `isDisabled`).
*   **Properties:**
    *   `Single connection mode`: If true, an item can have only one connection.
    *   `Block wrong answers`: Removes incorrect connections immediately if true.
    *   `Random order`: Can randomize Left or Right side items.
    *   `Colors`: Custom colors for default, correct, incorrect, and disabled lines.
*   **Validation:**
    *   IDs must be unique across both sides.
    *   Initial connections must point to existing IDs and distinct sides.
    *   Orientation layouts must not be duplicated.

### Presenter Logic
*   **Initialization (`run`):**
    *   Upgrades model (legacy support).
    *   Determines orientation (Horizontal/Vertical) based on current layout.
    *   Constructs DOM:
        *   **Vertical:** `<table>` with Left `<td>`, Middle `<td>` (Canvas), Right `<td>`.
        *   **Horizontal:** `<table>` with Top `<tr>`, Middle `<tr>` (Canvas), Bottom `<tr>`.
    *   Loads items into respective containers.
    *   Initializes `LineStack` to manage connections.
    *   Draws initial connections.
    *   Registers listeners (Click, Touch, Draggable/Droppable).
    *   Initializes MathJax.
*   **Interaction:**
    *   **Click:** Selects an item (`.selected`). Clicking a second item forms a connection if valid (different sides, allowed by single/multi mode). Clicking selected deselects. Clicking connected item in single mode may replace connection.
    *   **Drag:** Drags a helper element. Draws a temporary line (`#connection_line_tmp`) following the mouse/touch. Dropping on a target forms connection.
    *   **Keyboard:** Uses `ConnectionKeyboardController` for navigation.
*   **Drawing:**
    *   Uses HTML5 `<canvas>` (via `jcanvas` library or direct context) to draw lines.
    *   Redraws all lines on any change.
    *   Calculates "snap points" on items (center of edge facing the connection area) for line coordinates.
*   **Scoring & States:**
    *   `isAllOK`: True if max score reached and no errors.
    *   `getState`/`setState`: Serializes/Deserializes list of connected ID pairs (`id1:id2`).
    *   `setShowErrorsMode`: colors lines/items green (correct) or red (wrong).
    *   `showAnswers`: Displays correct connections (can be gradual).

### Style Rules
*   **Container:** `.connectionContainer` (Table).
*   **Layout:**
    *   Vertical: `.connectionLeftColumn`, `.connectionMiddleColumn`, `.connectionRightColumn`.
    *   Horizontal: `.connectionTopRow`, `.connectionMiddleRow`, `.connectionBottomRow`.
*   **Items:** `.connectionItem` (Table inside wrapper).
    *   Content: `.inner` -> `.innerWrapper`.
    *   Icon: `.icon` -> `.iconWrapper`.
    *   Wrapper: `.connectionItemWrapper` (td).
*   **States:**
    *   Selected: `.connectionItem.selected`.
    *   Correct: `.connectionItem.connectionItem-correct`.
    *   Wrong: `.connectionItem.connectionItem-wrong`.
*   **Canvas:** `.connections` (holds the drawing context).
*   **Printable:** Uses SVG (`<svg class="connections">`) instead of Canvas.

### Code Conventions (Addon Specific)
*   **LineStack:** Use the `LineStack` class to manage the state of connections.
*   **IDs:** Convert full IDs (e.g., `connection-ID`) to short IDs (e.g., `ID`) for logic.
*   **Events:** Send `ValueChanged` events for every connection change.

## Addon Development Guide

This guide generalizes the logic found in addons like `Connection` to assist in creating or modifying general-purpose addons.

### 1. File Structure
Standard directory structure for an addon (e.g., `AddonName`):
*   `addons/AddonName/`
    *   `src/`
        *   `addon.xml`: Defines the addon model, properties, and resources.
        *   `presenter.js`: Contains the JavaScript logic (the "Presenter").
        *   `view.html`: The HTML template for the runtime view.
        *   `preview.html`: The HTML template for the editor preview.
        *   `style.css`: Default CSS styles.
        *   `icon.png`: Icon displayed in the editor toolbar.
    *   `test/`: Directory for unit tests (JavaScript).
    *   `build.xml`: Ant script to package the addon.
    *   `documentation.md`: User documentation.

### 2. Model Definition (`addon.xml`)
The `addon.xml` defines the interface exposed to the editor.
*   **Properties:** Defined in `<model>`. Types include `string`, `boolean`, `text`, `html`, `list`, `staticlist`, `image`.
*   **Key Attributes:** `name` (internal ID), `displayName` (editor label), `type`.
*   **Resources:** CSS and JS files must be referenced.

### 3. Presenter Logic (`presenter.js`)
The presenter is the core logic. It must return a `presenter` object within a global creation function `Addon[Name]_create()`.

#### A. Standard Lifecycle Methods
*   `run(view, model)`: Initializes the addon in the lesson.
    *   **view:** The DOM element container.
    *   **model:** Raw configuration object from `addon.xml`.
*   `createPreview(view, model)`: Initializes the addon in the editor. Often shares logic with `run` but may mock certain features (like scoring).
*   `setPlayerController(controller)`: Injects the player controller (access to `EventBus`, `TextParser`, etc.).
*   `destroy()`: (Optional) Cleanup listeners.

#### B. Data Handling Patterns
*   **Model Upgrade:** Always implement a mechanism to upgrade old model versions (e.g., `upgradeModel(model)`) to support backward compatibility when adding new properties.
*   **Model Validation:** Convert raw strings from the XML model into a clean configuration object.
    *   Use helper functions (e.g., `ModelValidationUtils.validateBoolean`).
    *   Validate IDs, numbers, and enum selections.
    *   Return a `configuration` object used throughout the presenter.

#### C. State Management
*   `getState()`: Returns a JSON string representing the current state (e.g., user selection, visibility). Used for "Save/Resume".
*   `setState(state)`: Restores the addon from the JSON string. **Crucial:** Must handle cases where asynchronous resources (like MathJax or images) are not yet ready (use Deferred/Promises).
*   `reset()`: Restores the addon to its initial configuration (clears selections, errors).

#### D. Scoring (If Activity)
*   `getMaxScore()`: Total obtainable points.
*   `getScore()`: Current points earned.
*   `getErrorCount()`: Number of mistakes.
*   `setShowErrorsMode()`: Visual feedback for checking answers (e.g., green/red styling).
*   `setWorkMode()`: Return to interactive state, clearing error styling.

#### E. Event Handling
*   **Sending:** Use `presenter.eventBus.sendEvent('ValueChanged', data)` to notify the player of user actions.
*   **Receiving:** Implement `onEventReceived(eventName, data)` if subscribing to player events (like `ShowAnswers`).

### 4. Styling (`style.css`)
*   **Scoping:** Prefix classes to avoid conflicts (e.g., `.addonName_container`, `.addonName_item`).
*   **Standard Classes:**
    *   `.correct` / `.wrong`: For error checking visualization.
    *   `.selected`: For active items.
    *   `.disabled`: For non-interactive items.

### 5. Testing
*   **Framework:** JsTestDriver / Sinon.js.
*   **Unit Tests:** Test `validateModel`, `upgradeModel`, scoring logic, and state management in isolation.
*   **Mocking:** Mock the `view` (DOM) and `playerController` interactions.
# hex-transform

A VS Code extension that supports conversion between HEX, RGBA, HSL and other color formats.

## Function

### Smart Color Conversion Menu

- With the color code selected, right-click and select the &quot;Convert color format...&quot; option
- Or use the shortcut `cmd+shift+c` (Mac) / `ctrl+shift+c` (Windows/Linux)
- The plugin automatically identifies the color format and displays available conversion options
- Select the target format from the menu and complete the conversion with one click

## Example

### Smart Color Conversion Menu

![Smart Color Conversion Menu Example](https://cdn.jsdelivr.net/gh/GrapeWell/-/menu.gif)

### RGBA to HEX

Convert `rgba(255, 0, 0, 0.5)` to `#ff000080`

### HEX to HSL

Convert `#ff0000` to `hsl(0, 100%, 50%)`

### HSL to RGBA

Convert `hsla(240, 100%, 50%, 0.5)` to `rgba(0, 0, 255, 0.5)`

## Usage scenarios

- Quickly convert color formats in front-end development
- Color format conversion when design draft is realized
- A convenient tool for editing CSS/SASS/LESS and other style files
- Easily switch between different color representations to adjust color properties

## Features

- **Intelligent color format recognition**: Automatically detect the color format of the selected text and provide corresponding conversion options
- **Context Menu**: Quickly access all conversion functions via the right-click menu, without having to remember multiple shortcuts
- **Multiple format support**: Support HEX, RGB, RGBA, HSL, HSLA and other common CSS color formats

## Notes

- Make sure to select the complete color code before converting
- For invalid color formats, an error message will be displayed
- HSL format has hue (H) ranging from 0-360 degrees, saturation (S) and lightness (L) ranging from 0-100%

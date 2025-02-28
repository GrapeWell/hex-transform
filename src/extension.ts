import * as vscode from "vscode";

// 插件激活
export function activate(context: vscode.ExtensionContext) {
  // 注册颜色转换命令
  registerColorTransformCommands(context);

  // 注册颜色格式检测命令
  const detectColorFormatCommand = vscode.commands.registerCommand(
    "hex-transform.detectAndShowMenu",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      if (!text) {
        vscode.window.showInformationMessage(
          "Please select a color code first"
        );
        return;
      }

      // 检测颜色格式
      const colorFormat = detectColorFormat(text);
      if (!colorFormat) {
        vscode.window.showErrorMessage("Unrecognizable color format");
        return;
      }

      // 根据检测到的颜色格式，显示可用的转换选项
      const options = getConversionOptions(colorFormat);
      const selected = await vscode.window.showQuickPick(options, {
        placeHolder: `Detected ${colorFormat} format，Select the target format for conversion`,
      });

      if (!selected) {
        return;
      }

      // 执行选择的转换命令
      vscode.commands.executeCommand(selected.command, text);
    }
  );

  // 注册右键菜单
  const menuCommand = vscode.commands.registerCommand(
    "hex-transform.showMenu",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      if (!text) {
        vscode.window.showInformationMessage(
          "Please select a color code first"
        );
        return;
      }

      // 检测颜色格式
      const colorFormat = detectColorFormat(text);
      if (!colorFormat) {
        vscode.window.showErrorMessage("Unrecognizable color format");
        return;
      }

      // 根据检测到的颜色格式，显示可用的转换选项
      const options = getConversionOptions(colorFormat);

      // 添加右键菜单项
      options.forEach((option) => {
        vscode.commands.executeCommand(
          "setContext",
          `hex-transform:${option.command}`,
          true
        );
      });
    }
  );

  context.subscriptions.push(detectColorFormatCommand, menuCommand);
}

// 注册所有颜色转换命令
function registerColorTransformCommands(context: vscode.ExtensionContext) {
  // HEX到RGBA的转换命令
  const hexToRgbaCommand = vscode.commands.registerCommand(
    "hex-transform.hexToRgba",
    (text?: string) => {
      if (text) {
        // 直接使用传入的文本
        const result = hexToRgba(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid HEX color format.");
        }
      } else {
        // 使用选中的文本
        transformSelectedText(hexToRgba, "Invalid HEX color format.");
      }
    }
  );

  // RGBA到HEX的转换命令
  const rgbaToHexCommand = vscode.commands.registerCommand(
    "hex-transform.rgbaToHex",
    (text?: string) => {
      if (text) {
        const result = rgbaToHex(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid RGBA color format.");
        }
      } else {
        transformSelectedText(rgbaToHex, "Invalid RGBA color format.");
      }
    }
  );

  // HEX到HSL的转换命令
  const hexToHslCommand = vscode.commands.registerCommand(
    "hex-transform.hexToHsl",
    (text?: string) => {
      if (text) {
        const result = hexToHsl(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid HEX color format.");
        }
      } else {
        transformSelectedText(hexToHsl, "Invalid HEX color format.");
      }
    }
  );

  // HSL到HEX的转换命令
  const hslToHexCommand = vscode.commands.registerCommand(
    "hex-transform.hslToHex",
    (text?: string) => {
      if (text) {
        const result = hslToHex(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid HSL color format.");
        }
      } else {
        transformSelectedText(hslToHex, "Invalid HSL color format.");
      }
    }
  );

  // RGBA到HSL的转换命令
  const rgbaToHslCommand = vscode.commands.registerCommand(
    "hex-transform.rgbaToHsl",
    (text?: string) => {
      if (text) {
        const result = rgbaToHsl(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid RGBA color format.");
        }
      } else {
        transformSelectedText(rgbaToHsl, "Invalid RGBA color format.");
      }
    }
  );

  // HSL到RGBA的转换命令
  const hslToRgbaCommand = vscode.commands.registerCommand(
    "hex-transform.hslToRgba",
    (text?: string) => {
      if (text) {
        const result = hslToRgba(text);
        if (result) {
          replaceTextOrCopy(result);
        } else {
          vscode.window.showErrorMessage("Invalid HSL color format.");
        }
      } else {
        transformSelectedText(hslToRgba, "Invalid HSL color format.");
      }
    }
  );

  context.subscriptions.push(
    hexToRgbaCommand,
    rgbaToHexCommand,
    hexToHslCommand,
    hslToHexCommand,
    rgbaToHslCommand,
    hslToRgbaCommand
  );
}

// 插件卸载
export function deactivate() {}

// 替换选中文本或复制到剪贴板
function replaceTextOrCopy(result: string) {
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.selection) {
    editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, result);
    });
  } else {
    vscode.env.clipboard.writeText(result).then(() => {
      vscode.window.showInformationMessage(`Copied to clipboard: ${result}`);
    });
  }
}

// 通用的文本转换函数
function transformSelectedText(
  transformFn: (text: string) => string | null,
  errorMessage: string
) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const text = editor.document.getText(selection);

    const result = transformFn(text);
    if (result) {
      editor.edit((editBuilder) => {
        editBuilder.replace(selection, result);
      });
    } else {
      vscode.window.showErrorMessage(errorMessage);
    }
  }
}

// 检测颜色格式
function detectColorFormat(text: string): string | null {
  // 检测HEX格式
  if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(text)) {
    return "HEX";
  }

  // 检测RGBA格式
  if (/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)/.test(text)) {
    return "RGBA";
  }

  // 检测HSL格式
  if (
    /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/.test(text)
  ) {
    return "HSL";
  }

  return null;
}

// 获取可用的转换选项
function getConversionOptions(
  format: string
): { label: string; description: string; command: string }[] {
  const options: { label: string; description: string; command: string }[] = [];

  switch (format) {
    case "HEX":
      options.push(
        {
          label: "Convert to RGBA",
          description: "Convert HEX colors to RGBA format",
          command: "hex-transform.hexToRgba",
        },
        {
          label: "Convert to HSL",
          description: "Convert HEX colors to HSL format",
          command: "hex-transform.hexToHsl",
        }
      );
      break;
    case "RGBA":
      options.push(
        {
          label: "Convert to HEX",
          description: "Convert RGBA color to HEX format",
          command: "hex-transform.rgbaToHex",
        },
        {
          label: "Convert to HSL",
          description: "Convert RGBA color to HSL format",
          command: "hex-transform.rgbaToHsl",
        }
      );
      break;
    case "HSL":
      options.push(
        {
          label: "Convert to HEX",
          description: "Convert HSL colors to HEX format",
          command: "hex-transform.hslToHex",
        },
        {
          label: "Convert to RGBA",
          description: "Convert HSL colors to RGBA format",
          command: "hex-transform.hslToRgba",
        }
      );
      break;
  }

  return options;
}

function hexToRgba(text: string): string | null {
  // 去除可能存在的 # 符号
  const hex = text.startsWith("#") ? text.slice(1) : text;

  // 检查HEX格式是否有效
  if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex)) {
    return null;
  }

  // 如果是3位HEX，扩展为6位
  let hexValue =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;

  // 如果是8位HEX，提取alpha值
  const alpha =
    hexValue.length === 8 ? parseInt(hexValue.slice(6, 8), 16) / 255 : 1;

  // 提取RGB值
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);

  // 返回RGBA格式
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function rgbaToHex(text: string): string | null {
  // 匹配RGBA格式: rgba(r, g, b, a) 或 rgb(r, g, b)
  const rgbaRegex =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i;
  const match = text.match(rgbaRegex);

  if (!match) {
    return null;
  }

  // 提取RGB和Alpha值
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  // 验证RGB值是否在有效范围内
  if (
    r < 0 ||
    r > 255 ||
    g < 0 ||
    g > 255 ||
    b < 0 ||
    b > 255 ||
    a < 0 ||
    a > 1
  ) {
    return null;
  }

  // 转换为HEX格式
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // 如果alpha不是1，则添加alpha通道
  if (a < 1) {
    const aHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${rHex}${gHex}${bHex}${aHex}`;
  } else {
    return `#${rHex}${gHex}${bHex}`;
  }
}

function hexToHsl(text: string): string | null {
  // 先转换为RGBA
  const rgba = hexToRgba(text);
  if (!rgba) {
    return null;
  }

  // 再从RGBA转换为HSL
  return rgbaToHsl(rgba);
}

function hslToHex(text: string): string | null {
  // 先转换为RGBA
  const rgba = hslToRgba(text);
  if (!rgba) {
    return null;
  }

  // 再从RGBA转换为HEX
  return rgbaToHex(rgba);
}

function rgbaToHsl(text: string): string | null {
  // 匹配RGBA格式
  const rgbaRegex =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/i;
  const match = text.match(rgbaRegex);

  if (!match) {
    return null;
  }

  // 提取RGB和Alpha值
  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  // 计算HSL值
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // 转换为度数
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  // 返回HSL或HSLA格式
  if (a < 1) {
    return `hsla(${h}, ${s}%, ${lightness}%, ${a})`;
  } else {
    return `hsl(${h}, ${s}%, ${lightness}%)`;
  }
}

function hslToRgba(text: string): string | null {
  // 匹配HSL格式: hsl(h, s%, l%) 或 hsla(h, s%, l%, a)
  const hslRegex =
    /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([0-9.]+))?\s*\)/i;
  const match = text.match(hslRegex);

  if (!match) {
    return null;
  }

  // 提取HSL和Alpha值
  const h = parseInt(match[1], 10) / 360;
  const s = parseInt(match[2], 10) / 100;
  const l = parseInt(match[3], 10) / 100;
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  // 验证HSL值是否在有效范围内
  if (h < 0 || h > 1 || s < 0 || s > 1 || l < 0 || l > 1 || a < 0 || a > 1) {
    return null;
  }

  // 计算RGB值
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // 灰度
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // 转换为0-255范围
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  // 返回RGBA格式
  if (a < 1) {
    return `rgba(${red}, ${green}, ${blue}, ${a})`;
  } else {
    return `rgb(${red}, ${green}, ${blue})`;
  }
}

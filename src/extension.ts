import * as vscode from "vscode";

// 插件激活
export function activate(context: vscode.ExtensionContext) {
  const transform = vscode.commands.registerCommand(
    "hex-transform.transform",
    () => {
      // 获取当前选中的文本
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);

        // 将选中的HEX颜色转换为RGBA格式
        const rgba = hexToRgba(text);
        if (rgba) {
          editor.edit((editBuilder) => {
            editBuilder.replace(selection, rgba);
          });
        } else {
          vscode.window.showErrorMessage("Invalid HEX color format.");
        }
      }
    }
  );

  context.subscriptions.push(transform);
}

// 插件卸载
export function deactivate() {}

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

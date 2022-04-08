'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const codeOperations_1 = require("./codeOperations");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.switch', () => __awaiter(this, void 0, void 0, function* () {
        (0, codeOperations_1.openFileInPane)(codeOperations_1.FilePane.Current);
    }));
    context.subscriptions.push(disposable);
    let switchRightPaneDisposable = vscode.commands.registerCommand('extension.switchRightPane', () => __awaiter(this, void 0, void 0, function* () {
        (0, codeOperations_1.openFileInPane)(codeOperations_1.FilePane.Right);
    }));
    context.subscriptions.push(switchRightPaneDisposable);
    let switchLeftPaneDisposable = vscode.commands.registerCommand('extension.switchLeftPane', () => __awaiter(this, void 0, void 0, function* () {
        (0, codeOperations_1.openFileInPane)(codeOperations_1.FilePane.Left);
    }));
    context.subscriptions.push(switchLeftPaneDisposable);
    let switchOtherPaneDisposable = vscode.commands.registerCommand('extension.switchOtherPane', () => __awaiter(this, void 0, void 0, function* () {
        (0, codeOperations_1.openFileInPane)(codeOperations_1.FilePane.Other);
    }));
    context.subscriptions.push(switchOtherPaneDisposable);
    let toggleChangeTrackingDisposable = vscode.commands.registerCommand('extension.toggleTracker', () => __awaiter(this, void 0, void 0, function* () {
        (0, codeOperations_1.toggleTracking)();
    }));
    context.subscriptions.push(toggleChangeTrackingDisposable);
    context.subscriptions.push(codeOperations_1.changeTracker);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
"use strict";
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
exports.toggleTracking = exports.changeTracker = exports.FilePane = exports.openFileInPane = void 0;
const vscode = require("vscode");
const fileOperations_1 = require("./fileOperations");
class DocumentTracker extends vscode.Disposable {
    constructor() {
        super(() => {
            this._onDispose();
        });
        this._disposable = null;
        this._mainColumn = null;
        this._secondaryColumn = vscode.ViewColumn.Beside;
    }
    subscribeToChanges() {
        if (this._disposable != null) {
            return;
        }
        this._mainColumn = vscode.window.activeTextEditor.viewColumn;
        let subscriptions = [];
        vscode.window.onDidChangeActiveTextEditor(this._onEditorChange, this, subscriptions);
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    reset() {
        this._onDispose();
    }
    isTracking() {
        return this._disposable != null;
    }
    _onDispose() {
        if (this._disposable != null) {
            this._disposable.dispose();
        }
        this._disposable = null;
    }
    _onEditorChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscode.window.activeTextEditor.viewColumn == this._mainColumn) {
                let fileToOpen = yield findMatchToCurrent();
                if (fileToOpen) {
                    openFile(fileToOpen, this._secondaryColumn, true);
                }
            }
        });
    }
}
function openFile(fileName, column, preserveFocus = false) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Opening " + fileName + " in " + column + " pane");
        let uriFile = vscode.Uri.file(fileName);
        try {
            let document = yield vscode.workspace.openTextDocument(uriFile);
            yield vscode.window.showTextDocument(document, column, preserveFocus);
            console.log("Done opening " + document.fileName);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function findMatchToCurrent() {
    return __awaiter(this, void 0, void 0, function* () {
        let activeTextEditor = vscode.window.activeTextEditor;
        let document = activeTextEditor.document;
        let fileName = yield (0, fileOperations_1.findMatchedFileAsync)(document.fileName);
        return fileName;
    });
}
function openFileInPane(pane) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileName = yield findMatchToCurrent();
        if (!fileName)
            return;
        let viewColumn = null;
        let currentColumn = vscode.window.activeTextEditor.viewColumn;
        if (currentColumn == null) {
            currentColumn = vscode.ViewColumn.One;
        }
        switch (pane) {
            case FilePane.Current:
                viewColumn = currentColumn;
                break;
            case FilePane.Left:
                viewColumn = currentColumn - 1;
                break;
            case FilePane.Right:
                viewColumn = currentColumn + 1;
                break;
            case FilePane.Other:
                viewColumn = (currentColumn == vscode.ViewColumn.One ?
                    vscode.ViewColumn.Two :
                    currentColumn - 1);
                break;
        }
        openFile(fileName, viewColumn);
    });
}
exports.openFileInPane = openFileInPane;
var FilePane;
(function (FilePane) {
    FilePane[FilePane["Current"] = 0] = "Current";
    FilePane[FilePane["Left"] = 1] = "Left";
    FilePane[FilePane["Right"] = 2] = "Right";
    FilePane[FilePane["Other"] = 3] = "Other";
})(FilePane = exports.FilePane || (exports.FilePane = {}));
exports.changeTracker = new DocumentTracker();
function toggleTracking() {
    if (exports.changeTracker.isTracking()) {
        exports.changeTracker.reset();
        return;
    }
    exports.changeTracker.subscribeToChanges();
}
exports.toggleTracking = toggleTracking;
//# sourceMappingURL=codeOperations.js.map
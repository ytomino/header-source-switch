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
exports.findMatchedFileAsync = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function findMatchedFileAsync(currentFileName) {
    let dir = path.dirname(currentFileName);
    let extension = path.extname(currentFileName);
    // If there's no extension, then nothing to do
    if (!extension) {
        return Promise.resolve(null);
    }
    let fileWithoutExtension = path.basename(currentFileName).replace(extension, '');
    // Determine if the file is a header or source file.
    let extensions = null;
    let cfg = vscode.workspace.getConfiguration('headerSourceSwitch');
    let mappings = cfg.get('mappings');
    for (let i = 0; i < mappings.length; i++) {
        let mapping = mappings[i];
        if (mapping.header.indexOf(extension) != -1) {
            extensions = mapping.source;
        }
        else if (mapping.source.indexOf(extension) != -1) {
            extensions = mapping.header;
        }
        if (extensions) {
            console.log("Detected extension using map: " + mapping.name);
            break;
        }
    }
    if (!extensions) {
        console.log("No matching extension found");
        return Promise.resolve(null);
        ;
    }
    let extRegex = "(\\" + extensions.join("|\\") + ")$";
    let newFileName = fileWithoutExtension;
    let found = false;
    // Search the current directory for a matching file
    let filesInDir = fs.readdirSync(dir).filter((value, index, array) => {
        return (path.extname(value).match(extRegex) != undefined);
    });
    for (var i = 0; i < filesInDir.length; i++) {
        let fileName = filesInDir[i];
        let match = fileName.match(fileWithoutExtension + extRegex);
        if (match) {
            found = true;
            newFileName = match[0];
            break;
        }
    }
    if (found) {
        let newFile = path.join(dir, newFileName);
        return new Promise((resolve, reject) => {
            resolve(newFile);
        });
    }
    else {
        return findFileAsync(currentFileName, fileWithoutExtension, extRegex);
    }
}
exports.findMatchedFileAsync = findMatchedFileAsync;
function findFileAsync(fileWithExtension, fileWithoutExtension, extRegex) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield vscode.workspace.findFiles('**/' + fileWithoutExtension + '.*');
        let normalizedPaths = files.map((file) => {
            return path.normalize(file.fsPath);
        });
        let regex = fileWithoutExtension + extRegex;
        let filteredFiles = normalizedPaths.filter((value) => value !== fileWithExtension && value.match(regex));
        if (filteredFiles.length == 0) {
            return null; // No files found
        }
        // Try to order the filepaths based on closeness to original file
        let sortedPaths = filteredFiles.sort((a, b) => {
            let aRelative = path.relative(fileWithExtension, a);
            let bRelative = path.relative(fileWithExtension, b);
            let aDistance = aRelative.split(path.sep).length;
            let bDistance = bRelative.split(path.sep).length;
            return aDistance - bDistance;
        });
        return sortedPaths[0];
    });
}
//# sourceMappingURL=fileOperations.js.map
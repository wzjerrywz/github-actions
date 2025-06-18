"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class FileSystem {
    static async deleteDirectoryOrFile(path) {
        try {
            // 递归删除目录（force 选项允许删除非空目录）
            await fs.rm(path, { recursive: true, force: true });
            console.log(`目录已删除: ${path}`);
        }
        catch (error) {
            console.error(`删除目录失败: ${error}`);
        }
    }
    static async createDir(path) {
        try {
            await fs.mkdir(path, { recursive: true });
            console.log(`目录创建成功: ${path}`);
        }
        catch (error) {
            console.error(`创建目录失败: ${error}`);
        }
    }
    static async listDir(dirPath = '.') {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    console.log(`📁 目录: ${fullPath}`);
                }
                else {
                    console.log(`📄 文件: ${fullPath}`);
                }
            }
        }
        catch (error) {
            console.error(`读取目录失败: ${error}`);
        }
    }
}
exports.FileSystem = FileSystem;
;

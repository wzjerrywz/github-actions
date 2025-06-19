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
exports.Step = void 0;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const path = __importStar(require("path"));
const Const_1 = require("../common/Const");
const { __VERSION, INSTALL } = Const_1.Const;
class Step {
    URL_TEMPLATE = 'https://services.gradle.org/distributions-snapshots/gradle-<VERSION>-<TIMESTAMP>+0000-bin.zip';
    gradleVersionMap = new Map([
        ['9.1.0', '20250616002551'],
        ['9.0.0', '20250615010750'],
        ['8.14.2', '20250614045138'],
        ['7.6.5', '20250614030244'],
        ['7.6.4', '20250526080545']
    ]);
    async build(inputs) {
        const title = `build： ${JSON.stringify(inputs)} `;
        await this.groupWrapper(inputs, title, async ({ workDir, buildCmd, skipTest, otherParams }) => {
            // 切换指定工作目录  
            process.chdir(path.resolve(workDir));
            // 组装参数
            const params = ['clean', buildCmd];
            // 跳过测试
            if (skipTest) {
                params.push('-x');
                params.push('test');
            }
            // 补充参数
            if (otherParams && otherParams.trim() !== '') {
                // 任意多个空格分隔
                const otherArr = otherParams.split(/\s+/);
                params.push(...otherArr);
            }
            // 查看参数
            core.info(`gradle// ${params.join(' ')}`);
            // 执行构建
            await exec.exec('gradle', params);
        });
    }
    ;
    // step1. 查看
    async see(inputs) {
        await this.groupWrapper(inputs, '查看当前目录', async ({ workDir }) => {
            // 切换指定工作目录  
            process.chdir(path.resolve('./'));
            // 查看当前目录
            await exec.exec('pwd');
            // 查看当前目录下的文件
            await exec.exec('ls', ['-l', './']);
            // 查看当前目录下的文件
            await exec.exec('ls', ['-l', './build']);
            // 查看当前目录下的文件
            await exec.exec('ls', ['-l', './build/libs']);
        });
    }
    ;
    // 组装函数
    async groupWrapper(inputs, title, fn) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn(inputs);
        // end group
        core.endGroup();
    }
    ;
}
exports.Step = Step;

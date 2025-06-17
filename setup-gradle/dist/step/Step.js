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
const tc = __importStar(require("@actions/tool-cache"));
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
    // step1. 下载 gradle
    async downloadGradle(inputs) {
        const title = `下载 gradle , 版本号：${inputs.gradleVersion}`;
        await this.groupWrapper(inputs, title, async ({ gradleVersion, installPath }) => {
            const signature = this.gradleVersionMap.get(gradleVersion);
            const url = this.URL_TEMPLATE.replaceAll('<VERSION>', gradleVersion)
                .replaceAll('<TIMESTAMP>', signature);
            // 创建目录
            await exec.exec(`sudo mkdir -p ${installPath}`);
            // 目录授权
            await exec.exec(`sudo chmod -R 777 ${installPath}`);
            // 下载
            const tarName = `gradle-${gradleVersion}.zip`;
            await tc.downloadTool(url, path.resolve(installPath, tarName));
        });
    }
    ;
    // step2. 解压并配置环境变量
    async tarForEnv(inputs) {
        const title = `解压并配置环境变量`;
        await this.groupWrapper(inputs, title, async ({ gradleVersion, installPath }) => {
            const tarName = `gradle-${gradleVersion}.zip`;
            await exec.exec(`sudo unzip -d ${path.resolve(installPath)} -v ${path.resolve(installPath, tarName)} `);
            // 配置环境变量
            const signature = this.gradleVersionMap.get(gradleVersion);
            await exec.exec(`ls -l ./`);
            const gradleHome = path.resolve(installPath, `gradle-${gradleVersion}-${signature}+0000`);
            core.info(`gradleHome: ${gradleHome}`);
            core.exportVariable('GRADLE_HOME', gradleHome);
            // path
            core.addPath(path.join(gradleHome, 'bin'));
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

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
    URL_TEMPLATE = 'https://download.java.net/java/GA/jdk<VERSION>/<SIGNURE>/GPL/openjdk-<VERSION>_linux-x64_bin.tar.gz';
    jdkVersionMap = new Map([
        ['17.0.2', 'dfd4a8d0985749f896bed50d7138ee7f/8'],
        ['18.0.2', 'f6ad4b4450fd4d298113270ec84f30ee/9'],
        ['19.0.1', 'afdd2e245b014143b62ccb916125e3ce/10'],
        ['20.0.2', '6e380f22cbe7469fa75fb448bd903d8e/9'],
        ['21.0.2', 'f2283984656d49d69e91c558476027ac/13'],
        ['22.0.2', 'c9ecb94cd31b495da20a27d4581645e8/9'],
        ['23.0.2', '6da2a6609d6e406f85c491fcb119101b/7'],
        ['24', '1f9ff9062db4449d8ca828c504ffae90/36']
    ]);
    // step1. 下载 jdk
    async downloadJdk(inputs) {
        const title = `下载 jdk , 版本号：${inputs.jdkVersion}`;
        await this.groupWrapper(inputs, title, async ({ jdkVersion, installPath }) => {
            const signature = this.jdkVersionMap.get(jdkVersion);
            const url = this.URL_TEMPLATE.replaceAll('<VERSION>', jdkVersion)
                .replaceAll('<SIGNURE>', signature);
            // 创建目录
            await exec.exec(`sudo mkdir -p ${installPath}`);
            // 目录授权
            await exec.exec(`sudo chmod -R 777 ${installPath}`);
            // 下载
            const tarName = `openjdk-${jdkVersion}_linux-x64_bin.tar.gz`;
            await tc.downloadTool(url, path.resolve(installPath, tarName));
        });
    }
    ;
    // step2. 解压并配置环境变量
    async tarForEnv(inputs) {
        const title = `解压并配置环境变量`;
        await this.groupWrapper(inputs, title, async ({ jdkVersion, installPath }) => {
            const tarName = `openjdk-${jdkVersion}_linux-x64_bin.tar.gz`;
            await exec.exec(`sudo tar -zxvf ${path.resolve(installPath, tarName)} -C ${installPath}`);
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

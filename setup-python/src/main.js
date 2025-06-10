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
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const Step_1 = require("./step/Step");
function validateInputs(params) {
    if (!params.nvmVersion)
        throw new Error('nvmVersion input is required');
    if (!params.nodejsVersion)
        throw new Error('nodejsVersion input is required');
    return params;
}
async function run() {
    try {
        const inputs = validateInputs({
            nvmVersion: core.getInput('nvm-version', { required: true }),
            nodejsVersion: core.getInput('nodejs-version', { required: true }),
        });
        console.log(inputs);
        // step1 下载安装包
        await (0, Step_1.downloadConda)();
        // step2 安装 nvm
        await (0, Step_1.configConda)();
        // step3. 创建虚拟环境
        await (0, Step_1.createVirtualEnv)();
        const envName = 'github_actions_env';
        console.log('验证! 版本：\n');
        // 验证 Python 安装
        await exec.exec(`conda run -n ${envName} python --version`, []);
        await exec.exec(`conda run -n ${envName} pip --version`, []);
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

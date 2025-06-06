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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const cmd_1 = require("./cmd");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
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
        const nvmDir = path_1.default.join(os_1.default.homedir(), '.nvm');
        core.exportVariable('NVM_DIR', nvmDir);
        const nvm = `curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v${inputs.nvmVersion}/install.sh`;
        await exec.exec(nvm, []);
        await exec.exec('bash', ['install.sh']);
        // 加载 NVM 环境
        await exec.exec('bash', [
            '-c',
            `. ${nvmDir}/nvm.sh && nvm install ${inputs.nodejsVersion} && nvm use ${inputs.nodejsVersion} `
        ]);
        // 获取 Node.js 路径并添加到 PATH
        const nodePath = await exec.getExecOutput('bash', [
            '-c',
            `. ${nvmDir}/nvm.sh && dirname $( nvm which ${inputs.nodejsVersion} ) `
        ], {
            silent: true
        });
        console.log(`nodePath: ${nodePath.stdout}`);
        const nodeBinPath = path_1.default.join(nodePath.stdout.trim(), '');
        core.addPath(nodeBinPath);
        await exec.exec(nodeBinPath + '/' + 'node', ['-v']);
        core.info('###################################################################');
        const textGet = await (0, cmd_1.getText)('node', ['-v']);
        core.info(`Node.js Of by GetText:   ` + textGet);
        await exec.exec('node', ['-v']);
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(error);
    }
}
// run
run();

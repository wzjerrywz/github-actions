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
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const cmd_1 = require("./common/cmd");
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
        // const inputs = validateInputs({
        //   nvmVersion: core.getInput('nvm-version', { required: true }),
        //   nodejsVersion: core.getInput('nodejs-version', { required: true }),
        // })
        const condaVersion = 'py39_25.3.1-1';
        const condaUrl = `https://repo.anaconda.com/miniconda/Miniconda3-${condaVersion}-Linux-x86_64.sh`;
        // 下载 Conda 安装程序
        core.startGroup('下载 Conda 安装程序 ,  版本: ${condaVersion}');
        const soft = 'soft/conda.sh';
        const condaInstallerPath = await tc.downloadTool(condaUrl, './' + soft);
        core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
        const nowdir = await (0, cmd_1.getText)('pwd', []);
        core.info(`当前目录 nowdir : ${nowdir}`);
        await exec.exec('ls', ['-l', nowdir + '/' + soft]);
        core.endGroup();
        // 安装 Conda
        core.startGroup('安装 Conda');
        const down = await (0, cmd_1.getText)('pwd', []) + '/' + soft;
        const condaDir = path_1.default.join(os_1.default.homedir(), 'miniconda3');
        await exec.exec('bash', [
            down,
            '-b',
            '-p',
            condaDir
        ]);
        // 验证 Conda 安装
        await exec.exec('conda', ['--version']);
        const pythonVersion = '3.9.18';
        // 创建环境并安装指定版本的 Python
        core.startGroup(`创建 Conda 环境并安装 Python ${pythonVersion}`);
        const envName = 'github_actions_env';
        await exec.exec('conda', [
            'create',
            '-y',
            '-q',
            '-n',
            envName,
            `python=${pythonVersion}`
        ]);
        core.info(`Python ${pythonVersion} 已安装到环境 ${envName}`);
        core.endGroup();
        // 激活环境并配置 PATH
        const envBinDir = path_1.default.join(condaDir, 'envs', envName, 'bin');
        core.addPath(envBinDir);
        core.info(`已将 ${envBinDir} 添加到 PATH`);
        core.startGroup(`指定环境 ${envName} `);
        // conda 设置环境
        await exec.exec('conda', [
            'init'
        ]);
        await exec.exec('conda', [
            'activate',
            envName
        ]);
        // 验证 Python 安装
        await exec.exec('python', ['--version']);
        await exec.exec('pip', ['--version']);
        core.endGroup();
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

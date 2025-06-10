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
exports.downloadConda = downloadConda;
exports.configConda = configConda;
exports.createVirtualEnv = createVirtualEnv;
exports.activateEnv = activateEnv;
exports.validVersion = validVersion;
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
async function downloadConda() {
    const condaVersion = 'py39_25.3.1-1';
    const condaUrl = `https://repo.anaconda.com/miniconda/Miniconda3-${condaVersion}-Linux-x86_64.sh`;
    // 下载 Conda 安装程序
    core.startGroup(`下载 Conda 安装程序 ,  版本: ${condaVersion} `);
    const soft = 'soft/conda.sh';
    const condaInstallerPath = await tc.downloadTool(condaUrl, './' + soft);
    core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
    await exec.exec('ls', ['-l', './' + soft]);
    core.endGroup();
}
async function configConda() {
    // 安装 Conda
    core.startGroup('配置 Conda');
    const down = './' + 'soft/conda.sh';
    const condaDir = path_1.default.join(os_1.default.homedir(), 'miniconda3');
    await exec.exec('bash', [
        down,
        '-b',
        '-p',
        condaDir
    ]);
    // 验证 Conda 安装
    await exec.exec('conda', ['--version']);
    core.endGroup();
}
async function createVirtualEnv() {
    const pythonVersion = '3.9.18';
    // 创建环境并安装指定版本的 Python
    core.startGroup(`创建虚拟环境 Python 版本： ${pythonVersion}`);
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
    // 激活环境并配置 PATH
    const condaDir = path_1.default.join(os_1.default.homedir(), 'miniconda3');
    const envBinDir = path_1.default.join(condaDir, 'envs', envName, 'bin');
    core.addPath(envBinDir);
    core.info(`已将 ${envBinDir} 添加到 PATH`);
    // end 
    core.endGroup();
}
async function activateEnv() {
    const envName = 'github_actions_env';
    // init conda 
    const condaDir = path_1.default.join(os_1.default.homedir(), 'miniconda3');
    await exec.exec('source ' + condaDir + '/bin/activate', []);
    // 切换虚拟环境
    core.startGroup(`切换虚拟环境 `);
    await exec.exec('conda', [
        'activate',
        envName
    ]);
    // end 
    core.endGroup();
}
async function validVersion() {
    const envName = 'github_actions_env';
    core.startGroup('验证 Python 版本 和 pip 版本');
    // 验证 Python 安装
    // await exec.exec(`conda run -n ${envName} python --version`, [ ]);
    // await exec.exec(`conda run -n ${envName} pip --version`, [ ]);
    await exec.exec(`python --version`, []);
    await exec.exec(`pip --version`, []);
    core.endGroup();
}

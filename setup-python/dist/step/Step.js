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
const os = __importStar(require("os"));
const Const_1 = require("../common/Const");
const { __VERSION, INSTALL } = Const_1.Const;
class Step {
    CONDA_URL = 'https://repo.anaconda.com/miniconda/Miniconda3-<VERSION>-Linux-x86_64.sh';
    async condaDownload(inputs) {
        const title = ` 下载 conda .sh , 版本 ： ${inputs.condaVersion} `;
        await this.groupWrapper(inputs, title, async ({ condaVersion }) => {
            const url = this.CONDA_URL.replace('<VERSION>', condaVersion);
            core.info(`下载地址 : ${url}`);
            const downloadPath = './soft/conda.sh';
            const condaInstallerPath = await tc.downloadTool(url, downloadPath);
            core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
        });
    }
    ;
    async condaConfigPath(inputs) {
        const title = ` 配置 conda , 版本 ： ${inputs.condaVersion} `;
        await this.groupWrapper(inputs, title, async ({}) => {
            const down = './soft/conda.sh';
            const condaDir = path.join(os.homedir(), 'miniconda3');
            // 配置
            await exec.exec('bash', [down, '-b', '-p', condaDir]);
            // 配置环境变量
            const condaBinDir = path.join(condaDir, 'bin');
            // 添加 Conda 到 PATH
            core.addPath(condaBinDir);
            // 设置环境变量供后续步骤使用
            core.exportVariable('CONDA_HOME', condaDir);
        });
    }
    ;
    async pythonCreateEnv(inputs) {
        const title = ` 创建虚拟环境 , python 版本 ： ${inputs.pythonVersion} `;
        await this.groupWrapper(inputs, title, async ({ pythonVersion, virtualEnv }) => {
            // 创建虚拟环境
            await exec.exec('conda', [
                'create',
                '-y',
                '-q',
                '-n',
                virtualEnv,
                `python=${pythonVersion}`
            ]);
            // 显示
            core.info(`Python ${pythonVersion} 已安装到环境 ${virtualEnv}`);
        });
    }
    ;
    async pythonValidateVersion(inputs) {
        const title = ` 验证 python 版本 ： ${inputs.pythonVersion} `;
        await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
            // 验证
            //  验证 Python 安装
            await exec.exec(`conda run -n ${virtualEnv} python`, [__VERSION]);
            await exec.exec(`conda run -n ${virtualEnv} pip`, [__VERSION]);
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

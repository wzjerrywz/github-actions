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
const os = __importStar(require("os"));
const Const_1 = require("../common/Const");
const { __VERSION, INSTALL, NVM_DIR } = Const_1.Const;
const FileSystem_1 = require("../common/FileSystem");
class Step {
    URL_NVM = 'https://gitee.com/mirrors/nvm/raw/v<VERSION>/install.sh';
    async installNvm(inputs) {
        const title = `安装 nvm : ${inputs.nvmVersion}`;
        await this.groupWrapper(inputs, title, async ({ nvmVersion }) => {
            const nvmDownloadDir = path.resolve('./soft/nvm');
            // 创建目录
            await FileSystem_1.FileSystem.createDir(nvmDownloadDir);
            // 切换指定工作目录  
            process.chdir(nvmDownloadDir);
            // 下载 nvm
            const url = this.URL_NVM.replace('<VERSION>', nvmVersion);
            const nvm = `curl -o install.sh ${url}`;
            await exec.exec(nvm, []);
            await exec.exec('bash', ['install.sh']);
            // env
            const nvmDir = path.join(os.homedir(), '.nvm');
            core.exportVariable(NVM_DIR, nvmDir);
            // 查看路径位置
            await exec.exec('pwd');
        });
    }
    ;
    async installNodejs(inputs) {
        const title = `安装 nodejs : ${inputs.nodejsVersion}`;
        await this.groupWrapper(inputs, title, async ({ nodejsVersion }) => {
            // nvmDir
            const nvmDir = path.join(os.homedir(), '.nvm');
            // 加载 NVM 环境
            await exec.exec('bash', [
                '-c',
                `. ${nvmDir}/nvm.sh && nvm install ${nodejsVersion} && nvm use ${nodejsVersion} `
            ]);
            // 获取 Node.js 路径并添加到 PATH
            const nodePath = await exec.getExecOutput('bash', [
                '-c',
                `. ${nvmDir}/nvm.sh && dirname $( nvm which ${nodejsVersion} ) `
            ], {
                silent: true
            });
            console.log(`nodePath: ${nodePath.stdout}`);
            const nodeBinPath = path.join(nodePath.stdout.trim(), '');
            core.addPath(nodeBinPath);
            // NODEJS_HOME 导出
            core.exportVariable('NODEJS_HOME', nodeBinPath);
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

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
// import { Const } from '../common/Const';
// const { __VERSION, INSTALL } = Const;
const Tool_1 = require("../common/Tool");
class Step {
    inputs;
    URL_TEMPLATE = 'https://dist.nuget.org/win-x86-commandline/v<VERSION>/nuget.exe';
    SOURCE_MAP = Tool_1.Tool.smap('Tencent', 'https://mirrors.cloud.tencent.com/nuget/', 'Microsoft', 'https://api.nuget.org/v3/index.json', 'Huawei', 'https://mirrors.huaweicloud.com/repository/nuget/');
    downloadPath = '';
    constructor() {
        this.inputs = {
            nugetVersion: core.getInput('nuget-version', { required: true }),
            workDir: core.getInput('work-dir', { required: true }),
            appName: core.getInput('app-name', { required: true }),
            propsValue: core.getInput('props-value', { required: true }),
            nugetApiKey: core.getInput('nuget-api-key'),
        };
    }
    async go() {
        await this.download();
        await this.repo();
        await this.build();
        await this.see();
    }
    async download() {
        const { nugetVersion } = this.inputs;
        await this.groupWrapper(`下载 nuget 版本： ${nugetVersion}`, async () => {
            const url = this.URL_TEMPLATE.replace('<VERSION>', nugetVersion);
            await exec.exec('curl', ['-L', '-o', 'nuget.exe', url]);
            //
            this.downloadPath = path.resolve('./');
            core.info(`下载路径:: ：  ${this.downloadPath}`);
            //
            await exec.exec('ls', ['-l', this.downloadPath]);
        });
    }
    // 配置镜像源
    async repo() {
        await this.groupWrapper(`配置镜像源`, async () => {
            const repoName = 'Microsoft';
            const repoSource = this.SOURCE_MAP.get(repoName);
            //
            await exec.exec('mono', [`${this.downloadPath}/nuget.exe`, 'sources', 'add', '-Name', repoName, '-Source', repoSource]);
            await exec.exec('mono', [`${this.downloadPath}/nuget.exe`, 'sources', 'enable', '-Name', repoName]);
        });
    }
    // 构建项目
    async build() {
        const { workDir, appName, propsValue } = this.inputs;
        await this.groupWrapper(`构建项目`, async () => {
            // 切换到项目目录
            const projectPath = path.resolve(workDir);
            process.chdir(projectPath);
            // nuget spec
            await exec.exec('mono', [`${this.downloadPath}/nuget.exe`, 'spec']);
            // ls
            await exec.exec('ls', ['-l', './']);
            // 构建项目
            const params = [
                `${this.downloadPath}/nuget.exe`,
                'pack', `${appName}.nuspec`,
                '-Version',
                '1.3.2',
                '-Properties',
                `"${propsValue}"`,
                '-NoDefaultExcludes'
            ];
            await exec.exec('mono', params);
        });
    }
    // nuget push world.1.0.2.nupkg -Source https://api.nuget.org/v3/index.json -ApiKey [API_KEY] -Timeout 3000 -Verbosity detailed
    async push() {
        const { workDir, appName, propsValue, nugetApiKey } = this.inputs;
        await this.groupWrapper(`推送包`, async () => {
            // 从输入参数或环境变量获取 API Key , ok
            const apiKey = nugetApiKey || process.env.NUGET_API_KEY;
            if (!apiKey) {
                throw new Error('NuGet API Key 未提供，请设置 nuget-api-key 输入参数或 NUGET_API_KEY 环境变量');
            }
            // push
            const params = [
                `${this.downloadPath}/nuget.exe`,
                'push', `${appName}.nupkg`,
                '-Source', this.SOURCE_MAP.get('Microsoft'),
                '-ApiKey', apiKey,
                '-Timeout', '3000',
                '-Verbosity', 'detailed'
            ];
            await exec.exec('mono', params);
        });
    }
    // 查看
    async see() {
        await this.groupWrapper(`查看`, async () => {
            await exec.exec('ls', ['-l', './']);
            await exec.exec('pwd');
        });
    }
    // 组装函数++
    async groupWrapper(title, fn) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn();
        // end group
        core.endGroup();
    }
    ;
}
exports.Step = Step;

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
const { __VERSION, INSTALL, _VERSION } = Const_1.Const;
const { info } = core;
class Step {
    inputs;
    bigVersion = '3';
    URL_TEMPLATE = 'https://archive.apache.org/dist/maven/maven-<PREFIX>/<VERSION>/binaries/apache-maven-<VERSION>-bin.tar.gz';
    ENV_NAME = 'MAVEN_HOME';
    downloadPath = '';
    extractedPath = '';
    constructor() {
        this.validInputs();
    }
    // 整个流程
    async go() {
        await this.download();
        await this.tar();
        await this.env();
        await this.settings();
        await this.see();
    }
    // 下载
    async download() {
        const { mavenVersion, installPath } = this.inputs;
        await this.groupWrapper(` 下载 maven , 版本号 ${mavenVersion} `, async () => {
            const url = this.URL_TEMPLATE
                .replaceAll('<PREFIX>', this.bigVersion)
                .replaceAll('<VERSION>', mavenVersion);
            // 创建和授权目录 ./soft/maven
            await exec.exec(`sudo mkdir -p ${installPath}`);
            await exec.exec(`sudo chmod 777 ${installPath}`);
            this.downloadPath = await tc.downloadTool(url, path.resolve(installPath, `mvn${mavenVersion}.tar.gz`));
            core.info(`downloadPath:   ${this.downloadPath}`);
        });
    }
    // 解压
    async tar() {
        await this.groupWrapper(` 解压 `, async () => {
            this.extractedPath = await tc.extractTar(this.downloadPath);
            core.info(`extractedPath:   ${this.extractedPath}`);
        });
    }
    // 配置环境变量
    async env() {
        await this.groupWrapper(` 配置环境变量 `, async () => {
            const { mavenVersion } = this.inputs;
            // 配置环境变量
            const mavenHome = path.join(this.extractedPath, `apache-maven-${mavenVersion}`);
            // Add Maven to PATH
            core.addPath(path.join(mavenHome, 'bin'));
            core.exportVariable('MAVEN_HOME', mavenHome);
            core.exportVariable('M2_HOME', mavenHome);
            // 输出 maven-home
            core.setOutput('maven-home', mavenHome);
        });
    }
    // 配置 settings.xml , 用指定文件覆盖默认的 settings.xml
    async settings() {
        await this.groupWrapper(` 覆盖 settings.xml 文件 `, async () => {
            const { mavenVersion } = this.inputs;
            core.info(` 覆盖 settings.xml 文件 `);
        });
    }
    // 查看
    async see() {
        await this.groupWrapper(` 查看 `, async () => {
            await exec.exec(`java`, [_VERSION]);
            await exec.exec(`mvn`, ['-v']);
        });
    }
    validInputs() {
        // 获取输入参数
        this.inputs = {
            mavenVersion: core.getInput('maven-version', { required: true }),
            installPath: core.getInput('install-path', { required: true }),
        };
        // 验证输入参数
        core.info('validInputs() is ok 。');
    }
    // 组装函数
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

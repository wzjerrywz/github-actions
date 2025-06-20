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
const { __VERSION } = Const_1.Const;
class Step {
    DOWNLOAD_URL = 'https://download.mono-project.com/sources/mono/mono-<VERSION>.tar.xz';
    inputs;
    constructor(inputs) {
        this.inputs = inputs;
    }
    async go() {
        await this.configRepo();
        await this.downloadMono();
        await this.extract();
    }
    async configRepo() {
        const title = `配置 mono 源： ${this.inputs.monoVersion}`;
        await this.groupWrapper(title, async () => {
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
    }
    async downloadMono() {
        const { monoVersion } = this.inputs;
        await this.groupWrapper(`下载 mono ： ${monoVersion}`, async () => {
            const url = this.DOWNLOAD_URL.replaceAll('<VERSION>', monoVersion);
            await tc.downloadTool(url, path.resolve("./soft/mono", `mono-${monoVersion}.tar.xz`));
            //
            process.chdir(path.resolve("./soft/mono", ``));
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
    }
    // 解压
    async extract() {
        const { monoVersion } = this.inputs;
        await this.groupWrapper(`下载 mono ： ${monoVersion}`, async () => {
            const name = `mono-${monoVersion}.tar.xz`;
            await exec.exec(`tar -xvf ${name} -C ./`);
            //
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
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

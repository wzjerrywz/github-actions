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
const Const_1 = require("../common/Const");
const { __VERSION } = Const_1.Const;
class Step {
    // step1. 配置 mono 源
    async configRepo(inputs) {
        const title = `配置 mono 源：${inputs.monoVersion}`;
        await this.groupWrapper(inputs, title, async ({ monoVersion }) => {
            // const cmd1 = URL_1.replaceAll('<KEY_SERVER>', KEY_SERVER)
            //                    .replaceAll('<RECV_KEYS>', RECV_KEYS);
            // const cmd2 = URL_2.replaceAll('<DOWNLOAD_URL>', DOWNLOAD_URL)
            //                    .replaceAll('<MONO_VERSION>', monoVersion!)
            //                    .replaceAll('<ETC_CONFIG>', ETC_CONFIG);
            // // 执行
            // await exec.exec(cmd1);
            // await exec.exec(cmd2);
            // update
            const list = [
                'sudo apt update && sudo apt upgrade -y',
                'sudo apt install -y dirmngr gnupg apt-transport-https ca-certificates software-properties-common',
                'sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF',
                `sudo add-apt-repository 'deb https://download.mono-project.com/repo/ubuntu stable-jammy main'`,
                'sudo apt update',
                `sudo apt install -y mono-complete`,
                'sudo mono --version'
            ];
            // 执行
            list.forEach(async (item) => {
                await exec.exec(item);
            });
        });
    }
    ;
    // step2. 安装 mono 
    async install(inputs) {
        const title = `安装 mono : ${inputs.monoVersion}`;
        await this.groupWrapper(inputs, title, async ({ monoVersion }) => {
            // 安装 Mono
            // sudo apt install -y mono-complete=6.12.0.122*
            // const params = [ INSTALL , '-y', `mono-complete=${monoVersion!}*`];
            // await exec.exec('sudo apt', params);
        });
    }
    ;
    // step3. 查看 mono 版本
    async checkVersion(inputs) {
        // const title = `查看 mono 版本` ;
        // await this.groupWrapper(inputs, title, async ({  }) => {
        //     await exec.exec('sudo /usr/bin/mono', [__VERSION]);
        // });
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

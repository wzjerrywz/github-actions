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
const { __VERSION, INSTALL } = Const_1.Const;
class Step {
    // step1. 安装 git 
    async installGit(inputs) {
        const title = `安装git软件： apt-get install -y git`;
        await this.groupWrapper(inputs, title, async (inputs) => {
            core.info(`${inputs.repoName}`);
            // 安装 git
            await exec.exec('sudo', ['apt-get', INSTALL, '-y', 'git']);
            // 验证安装是否成功
            await exec.exec('git', [__VERSION]);
        });
    }
    ;
    async gitCloneComplex(inputs) {
        const title = `git clone 复杂操作`;
        await this.groupWrapper(inputs, title, async (inputs) => {
            const [owner, repo] = inputs.repoName.split('/');
            console.log(`owner: ${owner}, repo: ${repo}`);
            let USERNAME = '';
            let TOKEN = '';
            let URL = '';
            switch (owner) {
                case 'gitee':
                    USERNAME = inputs.giteeUsername || '';
                    TOKEN = inputs.giteeToken || '';
                    URL = 'https://oauth2:<TOKEN>@gitee.com/<USERNAME>/<REPOSITORY>.git';
                    break;
                case 'github':
                    USERNAME = inputs.giteeUsername || '';
                    TOKEN = inputs.giteeToken || '';
                    URL = 'git@github.com:<USERNAME>/<REPOSITORY>.git';
                    break;
                case 'gitlab':
                    break;
                default:
                    break;
            }
            const gitUrl = URL.replace('<USERNAME>', USERNAME)
                .replace('<TOKEN>', TOKEN)
                .replace('<REPOSITORY>', repo);
            await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, gitUrl]);
            await exec.exec('ls', ['-l', './']);
            // 查看目录位置
            core.info(`当前目录: ${process.cwd()}`);
            await exec.exec('pwd');
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

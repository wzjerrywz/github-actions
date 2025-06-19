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
const Const_1 = require("../common/Const");
const { __VERSION, INSTALL } = Const_1.Const;
class Step {
    // async pipValidateVersion(inputs: Partial<InputParamsType>) {
    //     const title = ` 验证 pip 版本 ： ${inputs.pipVersion} ` ;
    //     await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
    //             // 验证
    //             //  验证 Python 安装
    //             await exec.exec(`conda run -n ${virtualEnv} python`, [ __VERSION ]);
    //             await exec.exec(`conda run -n ${virtualEnv} pip`, [ __VERSION ]);
    //     });
    // };
    // 清华镜像
    INDEX_URL = 'https://pypi.tuna.tsinghua.edu.cn/simple';
    async registerSpeedup(inputs) {
        const title = ` 注册加速镜像 `;
        await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
            // 注册加速镜像
            // pip config set global.index-url 
            const params = ['config', 'set', 'global.index-url', this.INDEX_URL];
            await exec.exec(`conda run -n ${virtualEnv} pip`, params);
        });
    }
    ;
    async pipVersionInstall(inputs) {
        const title = ` 安装指定的 pip  版本： ${inputs.pipVersion} `;
        await this.groupWrapper(inputs, title, async ({ virtualEnv, pipVersion }) => {
            //   pip 安装 pip install --no-cache-dir --force-reinstall pip==23.1.2
            const params = [
                INSTALL,
                '--no-cache-dir',
                '--force-reinstall',
                `pip==${pipVersion}`
            ];
            await exec.exec(`conda run -n ${virtualEnv} pip`, params);
        });
    }
    ;
    async projectSetup(inputs) {
        const title = ` python  setup `;
        await this.groupWrapper(inputs, title, async ({ virtualEnv, pipVersion }) => {
            // 切换目录
            const workDir = './demo-python312-pip';
            process.chdir(path.resolve(workDir));
            // pwd 
            await exec.exec(`pwd`);
            await exec.exec(`ls -lh ./`);
            // await exec.exec(`conda run -n ${virtualEnv} pip`, params);
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

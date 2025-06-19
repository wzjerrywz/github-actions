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
    COMPANY_REGISTRY = 'https://registry.npmmirror.com';
    async yarnVersion(inputs) {
        const title = ` 安装 yarn 版本 ： ${inputs.yarnVersion} `;
        await this.groupWrapper(inputs, title, async ({ yarnVersion }) => {
            await exec.exec('npm', [INSTALL, '-g', `yarn@${yarnVersion}`]);
        });
    }
    ;
    async configRegistry(inputs) {
        const title = ` 配置 yarn 镜像源 ： ${this.COMPANY_REGISTRY}  `;
        await this.groupWrapper(inputs, title, async ({}) => {
            await exec.exec('yarn', ['config', 'set', 'registry', this.COMPANY_REGISTRY]);
        });
    }
    ;
    async projectInstall(inputs) {
        const title = ` 项目安装依赖 ： yarn install `;
        await this.groupWrapper(inputs, title, async ({ projectPath }) => {
            // 切换到项目目录
            process.chdir(path.resolve(projectPath));
            // 安装依赖
            await exec.exec('yarn', [INSTALL]);
        });
    }
    ;
    async build(inputs) {
        // clean
        await exec.exec('yarn', ['clean']);
        // build
        const title = ` 项目打包 ： yarn  ${inputs.buildCommand} `;
        await this.groupWrapper(inputs, title, async ({ projectPath, buildCommand }) => {
            // 项目打包
            await exec.exec('yarn', [buildCommand]);
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

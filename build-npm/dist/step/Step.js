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
    async npmVersion(inputs) {
        const title = ` 设置 npm 版本 ： ${inputs.npmVersion} `;
        await this.groupWrapper(inputs, title, async ({ npmVersion }) => {
            await exec.exec('npm', [INSTALL, '-g', `npm@${npmVersion}`]);
        });
    }
    ;
    async nrmInstall(inputs) {
        const title = ` 安装 nrm ： ${inputs.nrmVersion}  ， 指定镜像： ${inputs.nrmSpeed} `;
        await this.groupWrapper(inputs, title, async ({ nrmVersion, nrmSpeed }) => {
            await exec.exec('npm', [INSTALL, '-g', `nrm@${nrmVersion}`]);
            // nrm add company-registry https://registry.your-company.com
            const nrmMap = new Map([
                ['company1', 'https://registry.your-company-01.com'],
                ['company2', 'https://registry.your-company-02.com'],
                ['company3', 'https://registry.your-company-03.com']
            ]);
            // 添加 nrm
            nrmMap.forEach(async (value, key) => {
                await exec.exec('nrm', ['add', key, value]);
            });
            // 配置 nrm
            await exec.exec('nrm', ['use', nrmSpeed]);
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

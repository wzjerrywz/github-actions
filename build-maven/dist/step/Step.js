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
const { __VERSION, INSTALL, _VERSION } = Const_1.Const;
const { info } = core;
class Step {
    inputs;
    constructor() {
        this.validInputs();
    }
    // 整个流程
    async go() {
        await this.pkg();
        await this.see();
    }
    // mvn clean package -DskipTests=true
    async pkg() {
        const { workDir, skipTest } = this.inputs;
        await this.groupWrapper(` mvn clean package -DskipTests=${skipTest} `, async () => {
            // 切换目录
            process.chdir(workDir);
            // 执行命令
            await exec.exec(`mvn`, ['clean', 'package', `-DskipTests=${skipTest}`]);
        });
    }
    // 查看 工作目录 和 目标目录
    async see() {
        await this.groupWrapper(` 查看 `, async () => {
            await exec.exec(`pwd`);
            await exec.exec(`ls -l ./`);
            await exec.exec(`ls -l ./target`);
        });
    }
    validInputs() {
        // 获取输入参数
        this.inputs = {
            workDir: core.getInput('work-dir', { required: true }),
            skipTest: core.getInput('skip-test', { required: true }),
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

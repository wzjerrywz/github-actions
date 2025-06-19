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
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const Step_1 = require("./step/Step");
const Const_1 = require("./common/Const");
const { __VERSION } = Const_1.Const;
function validateInputs(params) {
    return params;
}
async function run() {
    try {
        const inputs = validateInputs({
            virtualEnv: core.getInput('virtual-env', { required: true }),
            pipVersion: core.getInput('pip-version', { required: true }),
            pkgMode: core.getInput('pkg-mode', { required: true }),
            workDir: core.getInput('work-dir', { required: true }),
        });
        console.log("inputs: ", inputs);
        // steps
        const step = new Step_1.Step();
        await step.registerSpeedup(inputs);
        await step.pipVersionInstall(inputs);
        // 根据打包方式执行不同的步骤
        switch (inputs.pkgMode) {
            case 'setup':
                await step.projectSetup(inputs);
                break;
            case 'build':
                await step.projectBuild(inputs);
                break;
            case 'pyinstaller':
                await step.projectPyinstaller(inputs);
                break;
        }
        // 验证 conda 版本
        const vvv = `conda run -n ${inputs.virtualEnv} `;
        await exec.exec(`${vvv}pip`, [__VERSION]);
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

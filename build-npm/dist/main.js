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
function validateInputs(params) {
    return params;
}
async function run() {
    try {
        const inputs = validateInputs({
            projectPath: core.getInput('project-path', { required: true }),
            buildCommand: core.getInput('build-command', { required: true }),
            npmVersion: core.getInput('npm-version', { required: true }),
            nrmVersion: core.getInput('nrm-version', { required: true }),
            nrmSpeed: core.getInput('nrm-speed', { required: true }),
        });
        const step = new Step_1.Step();
        await step.npmVersion(inputs);
        await step.nrmInstall(inputs);
        // 查看 npm 版本
        await exec.exec('npm', ['-v']);
        // 查看 nrm 配置
        await exec.exec('nrm', ['ls']);
        //  // 安装 nrm
        //  // 配置 nrm
        //  await exec.exec('nrm', ['use', inputs.nrmSpeed]);
        //  // 查看 nrm 配置
        //  await exec.exec('nrm', ['ls']);
        //   const projectPath = path.resolve(inputs.projectPath);
        //   console.log(`projectPath: ${projectPath}`);
        //   process.chdir(projectPath);
        //   await exec.exec('npm', ['install']);
        //   await exec.exec('npm', ['run', `${inputs.buildCommand}`]);
        //   await exec.exec('ls', ['-l', './']);
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(error);
    }
}
// run
run();

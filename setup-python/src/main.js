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
            condaVersion: core.getInput('conda-version', { required: true }),
            pythonVersion: core.getInput('python-version', { required: true }),
            virtualEnv: core.getInput('virtual-env', { required: true }),
        });
        console.log("inputs: ", inputs);
        // steps
        const step = new Step_1.Step();
        await step.condaDownload(inputs);
        await step.condaConfigPath(inputs);
        await step.pythonCreateEnv(inputs);
        await step.pythonValidateVersion(inputs);
        // 验证 conda 版本
        await exec.exec(`conda`, [__VERSION]);
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

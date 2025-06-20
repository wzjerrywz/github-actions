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
exports.run = run;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const Step_1 = require("./step/Step");
const Const_1 = require("./common/Const");
const { _VERSION, INSTALL } = Const_1.Const;
function validateInputs(params) {
    return params;
}
async function run() {
    try {
        // 验证输入
        const inputs = validateInputs({
            gradleVersion: core.getInput('gradle-version', { required: true }),
            installPath: core.getInput('install-path', { required: true }),
        });
        const step = new Step_1.Step();
        await step.downloadGradle(inputs);
        await step.tarForEnv(inputs);
        // 查看版本
        await exec.exec('gradle', ['-v']);
        // 查看 jdk 版本
        // await exec.exec('java', [_VERSION]);
        // await exec.exec('ls', ['-l', './demo-gradle-groovy-build']);
        // const hello = '/home/runner/work/myts-action/myts-action';
        // 查看当前目录
        // await exec.exec('ls', ['-l', hello]);
        // process.chdir(`${hello}/demo-gradle-groovy-build` );
        // 执行 gradle clean build
        // await exec.exec('gradle', ['clean', 'build']);
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
;
// run
run();

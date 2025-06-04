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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const cmd_1 = require("./cmd");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
function validateInputs(params) {
    if (!params.text)
        throw new Error('Text input is required');
    return params;
}
async function run() {
    try {
        const nvmDir = path_1.default.join(os_1.default.homedir(), '.nvm');
        core.exportVariable('NVM_DIR', nvmDir);
        const nvm = 'curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh';
        await exec.exec(nvm, []);
        await exec.exec('bash', ['install.sh']);
        // 加载 NVM 环境
        await exec.exec('bash', [
            '-c',
            `. ${nvmDir}/nvm.sh && nvm install 18 && nvm use 18 `
        ]);
        // 获取 Node.js 路径并添加到 PATH
        const nodePath = await exec.getExecOutput('bash', [
            '-c',
            `. ${nvmDir}/nvm.sh && dirname $( nvm which 18 ) `
        ], {
            silent: true
        });
        console.log(`nodePath: ${nodePath.stdout}`);
        const nodeBinPath = path_1.default.join(nodePath.stdout.trim(), 'bin');
        core.addPath(nodeBinPath);
        const textGet = await (0, cmd_1.getText)('node', ['-v']);
        console.log(textGet);
        core.info(`Node.js Of by GetText:   ` + textGet);
        await exec.exec('node', ['-v']);
        // const url = 'https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_linux-x64_bin.tar.gz';
        // await exec.exec('wget', ['-q', url]);
        // await exec.exec('tar', ['-xf', 'openjdk-17_linux-x64_bin.tar.gz', '-C', './']);
        // const jdkHome = await capture('pwd', [])  + '/jdk-17' ;
        // await exec.exec('chmod', ['+x', `${jdkHome}/bin/java`]);
        // 设置 JAVA_HOME 环境变量
        // core.exportVariable('JAVA_HOME', jdkHome);
        // 设置其他变量（如 PATH）
        // core.exportVariable('PATH', `${jdkHome}/bin:${process.env.PATH}`);
        // await exec.exec('java', ['-version']);
        // await exec.exec('ls', ['./'])
        // await exec.exec('npm', ['i', 'npm@latest'])
        const inputs = validateInputs({
            text: core.getInput('hello-world')
        });
        core.info(`Processing with: ${JSON.stringify(inputs)}`);
        const result = {
            original: inputs,
            processedAt: new Date().toISOString(),
            message: `Received ${inputs.text} with 1 selection`
        };
        core.setOutput('report', JSON.stringify(result));
        core.summary
            .addHeading('Action Results')
            .addTable([
            ['Field', 'Value'],
            ['Text', inputs.text]
        ])
            .write();
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(error);
    }
}
// run
run();

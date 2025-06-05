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
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
function validateInputs(params) {
    if (!params.gitVersion)
        throw new Error('gitVersion input is required');
    return params;
}
async function run() {
    try {
        const inputs = validateInputs({
            gitVersion: core.getInput('git-version', { required: true })
        });
        const gitDownloadUrl = `https://www.kernel.org/pub/software/scm/git/git-${inputs.gitVersion}.tar.gz`;
        // 下载 git.tar.gz
        core.startGroup(`下载 git.tar.gz ,  版本: ${inputs.gitVersion}`);
        const gitFilePath = await tc.downloadTool(gitDownloadUrl, './soft/git.tar.gz');
        core.info(`git  ${inputs.gitVersion} 安装程序已下载到 :   ./soft/git.tar.gz `);
        // 解压
        const gitDir = await tc.extractTar(gitFilePath, './soft/');
        core.info(`git  ${inputs.gitVersion} 安装程序已解压到 :  ${gitDir} `);
        await exec.exec(`ls -l ${gitDir}`, []);
        core.endGroup();
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

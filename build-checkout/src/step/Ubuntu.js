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
exports.installGit = installGit;
exports.gitClone = gitClone;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
// step1. 安装 git 
async function installGit(inputs) {
    // 安装 git
    core.startGroup(`安装git软件： apt-get install -y git`);
    await exec.exec('sudo', ['apt-get', 'install', '-y', 'git']);
    core.endGroup();
    // 验证安装是否成功
    await exec.exec('git', ['--version']);
}
// step2. git clone
async function gitClone(inputs) {
    const url = `https://oauth2:${inputs.token}@gitee.com/${inputs.owner}/${inputs.projectName}.git`;
    core.startGroup(` git clone -b ${inputs.branchName} ${url} `);
    await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, url]);
    core.endGroup();
    // 验证安装是否成功
    await exec.exec('ls', ['-l', './']);
}

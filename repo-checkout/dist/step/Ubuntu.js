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
exports.gitCloneComplex = gitCloneComplex;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
async function gitCloneComplex(inputs) {
    process.chdir("./repo");
    core.startGroup(`git clone 复杂操作`);
    const [owner, repo] = inputs.repoName.split('/');
    console.log(`owner: ${owner}, repo: ${repo}`);
    let USERNAME = '';
    let TOKEN = '';
    let URL = '';
    switch (owner) {
        case 'gitee':
            USERNAME = process.env.GITEE_USERNAME || '';
            TOKEN = process.env.GITEE_TOKEN || '';
            URL = 'https://oauth2:<TOKEN>@gitee.com/<USERNAME>/<REPOSITORY>.git';
            break;
        case 'github':
            USERNAME = process.env.GITHUB_USERNAME || '';
            TOKEN = process.env.GITHUB_TOKEN || '';
            URL = 'git@github.com:<USERNAME>/<REPOSITORY>.git';
            break;
        case 'gitlab':
            break;
        default:
            break;
    }
    const gitUrl = URL.replace('<USERNAME>', USERNAME)
        .replace('<TOKEN>', TOKEN)
        .replace('<REPOSITORY>', repo);
    core.startGroup(`git clone -b ${inputs.branchName} ${gitUrl}`);
    await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, gitUrl]);
    core.endGroup();
    await exec.exec('ls', ['-l', './']);
}

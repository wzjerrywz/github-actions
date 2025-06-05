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
    if (!params.dotnetVersion)
        throw new Error('dotnetVersion input is required');
    return params;
}
async function run() {
    try {
        const inputs = validateInputs({
            dotnetVersion: core.getInput('dotnet-version', { required: true })
        });
        const url = 'https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb';
        core.startGroup(`下载安装 dotnet ,  版本: ${inputs.dotnetVersion} `);
        const soft = 'packages-microsoft-prod.deb';
        const installerPath = await tc.downloadTool(url, './' + soft);
        core.info(` dotnet  ${inputs.dotnetVersion} 安装程序已下载到 :   ${installerPath}`);
        // 
        await exec.exec(`sudo dpkg -i ${soft} `, []);
        await exec.exec(`rm ${soft}`, []);
        await exec.exec(`sudo apt-get update`, []);
        await exec.exec(`sudo apt-get install -y apt-transport-https `, []);
        core.info(` dotnet  ${inputs.dotnetVersion} 安装完成 `);
        core.endGroup();
    }
    catch (error) {
        core.setFailed(String(error));
        throw new Error(error);
    }
}
// run
run();

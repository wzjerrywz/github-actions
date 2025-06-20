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
const path = __importStar(require("path"));
const Const_1 = require("../common/Const");
const { __VERSION, INSTALL } = Const_1.Const;
class Step {
    PROXY_URL = 'https://goproxy.cn,direct';
    async configProxy(inputs) {
        const title = `配置代理： ${JSON.stringify(inputs)} `;
        await this.groupWrapper(inputs, title, async ({}) => {
            // 配置代理
            await exec.exec('go', ['env', '-w', 'GOPROXY=' + this.PROXY_URL]);
            // 查看代理
            await exec.exec('go', ['env', '|', 'grep', 'GOPROXY']);
        });
    }
    ;
    async build(inputs) {
        const title = `构建： ${JSON.stringify(inputs)} `;
        await this.groupWrapper(inputs, title, async ({ workDir }) => {
            // 切换目录
            process.chdir(path.resolve(workDir));
            // 执行构建
            // # 清理所有编译缓存
            // go clean -modcache
            await exec.exec('go', ['clean', '-modcache']);
            // # 清理当前项目的构建缓存
            // go clean -i -r
            await exec.exec('go', ['clean', '-i', '-r']);
            // # 执行构建（强制重新编译所有依赖）
            // go build -a -v -o out-file
            await exec.exec('go', ['build', '-a', '-v', '-o', 'out-file']);
        });
    }
    ;
    // step1. 查看
    async see(inputs) {
        await this.groupWrapper(inputs, '查看当前目录', async ({ workDir }) => {
            // 切换指定工作目录  
            process.chdir(path.resolve('./'));
            // 查看当前目录
            await exec.exec('pwd');
            // 查看当前目录下的文件
            await exec.exec('ls', ['-l', './']);
        });
    }
    ;
    // 组装函数
    async groupWrapper(inputs, title, fn) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn(inputs);
        // end group
        core.endGroup();
    }
    ;
}
exports.Step = Step;

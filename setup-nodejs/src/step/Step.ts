import { InputParamsType } from "../type/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

import { Const } from '../common/Const';
const { __VERSION, INSTALL, NVM_DIR } = Const;

import { FileSystem } from '../common/FileSystem';

export class Step {

    URL_NVM = 'https://gitee.com/mirrors/nvm/raw/v<VERSION>/install.sh';

    async installNvm(inputs: Partial<InputParamsType>) {
        const title = `安装 nvm : ${inputs.nvmVersion}` ;
        await this.groupWrapper(inputs, title, async ({ nvmVersion }) => {
                const nvmDownloadDir = path.resolve('./soft/nvm');
                // 创建目录
                await FileSystem.createDir(nvmDownloadDir);
                // 切换指定工作目录  
                process.chdir(nvmDownloadDir);
                // 下载 nvm
                const url = this.URL_NVM.replace('<VERSION>', nvmVersion!);
                const nvm = `curl -o install.sh ${url}` ;
                await exec.exec(nvm, []);
                await exec.exec('bash', ['install.sh']);
                // env
                const nvmDir = path.join(os.homedir(), '.nvm');
                core.exportVariable(NVM_DIR, nvmDir);
                // 查看路径位置
                await exec.exec('pwd');
        });
    };


    async installNodejs(inputs: Partial<InputParamsType>) {
        const title = `安装 nodejs : ${inputs.nodejsVersion}` ;
        await this.groupWrapper(inputs, title, async ({ nodejsVersion }) => {
               // nvmDir
               const nvmDir = path.join(os.homedir(), '.nvm');
               // 加载 NVM 环境
                await exec.exec('bash', [
                    '-c',
                    `. ${nvmDir}/nvm.sh && nvm install ${nodejsVersion} && nvm use ${nodejsVersion} `
                ]);
                // 获取 Node.js 路径并添加到 PATH
                const nodePath = await exec.getExecOutput('bash', [
                    '-c',
                    `. ${nvmDir}/nvm.sh && dirname $( nvm which ${nodejsVersion} ) `
                ], {
                    silent: true
                });
                console.log(`nodePath: ${nodePath.stdout}`);
                
                const nodeBinPath = path.join(nodePath.stdout.trim(), '');
                core.addPath(nodeBinPath);
                // NODEJS_HOME 导出
                core.exportVariable('NODEJS_HOME', nodeBinPath);
            
        });
    };  

 

    // 组装函数
    async  groupWrapper(inputs: Partial<InputParamsType>, title: string, fn: (inputs: Partial<InputParamsType>) => Promise<void>) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn(inputs);
        // end group
        core.endGroup();
    };


}
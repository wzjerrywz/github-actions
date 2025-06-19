import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    CONDA_URL = 'https://repo.anaconda.com/miniconda/Miniconda3-<VERSION>-Linux-x86_64.sh';
  
    async condaDownload(inputs: Partial<InputParamsType>) {
        const title = ` 下载 conda .sh , 版本 ： ${inputs.condaVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ condaVersion }) => {
            const url = this.CONDA_URL.replace('<VERSION>', condaVersion! );
            core.info(`下载地址 : ${url}`);
            const downloadPath = './soft/conda.sh';
            const condaInstallerPath = await tc.downloadTool(url, downloadPath);
            core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
        });
    };

    async condaConfigPath(inputs: Partial<InputParamsType>) {
        const title = ` 配置 conda , 版本 ： ${inputs.condaVersion} ` ;
        await this.groupWrapper(inputs, title, async ({  }) => {
              const down = './soft/conda.sh';
              const condaDir = path.join(os.homedir(), 'miniconda3');
              // 配置
              await exec.exec('bash', [  down,  '-b',  '-p',  condaDir  ]);
              // 配置环境变量
              const condaBinDir = path.join(condaDir, 'bin');
              // 添加 Conda 到 PATH
              core.addPath(condaBinDir);
              // 设置环境变量供后续步骤使用
              core.exportVariable('CONDA_HOME', condaDir);
        });
    };

    async pythonCreateEnv(inputs: Partial<InputParamsType>) {
        const title = ` 创建虚拟环境 , python 版本 ： ${inputs.pythonVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ pythonVersion, virtualEnv }) => {
              // 创建虚拟环境
              await exec.exec('conda', [
                'create',
                '-y',
                '-q',
                '-n', 
                virtualEnv!,
                `python=${pythonVersion}` 
              ]);
              // 显示
              core.info(`Python ${pythonVersion} 已安装到环境 ${virtualEnv}`);
              // 设置到 output
              core.setOutput('virtual-env', virtualEnv);
        });
    };

    async pythonValidateVersion(inputs: Partial<InputParamsType>) {
        const title = ` 验证 python 版本 ： ${inputs.pythonVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
                // 验证
                //  验证 Python 安装
                await exec.exec(`conda run -n ${virtualEnv} python`, [ __VERSION ]);
                await exec.exec(`conda run -n ${virtualEnv} pip`, [ __VERSION ]);
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
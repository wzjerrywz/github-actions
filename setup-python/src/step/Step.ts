import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

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
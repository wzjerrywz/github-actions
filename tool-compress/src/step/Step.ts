import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';

import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    // step1. 压缩目录或文件
    async compress(inputs: Partial<InputParamsType>) {
        await this.groupWrapper(inputs, '压缩目录或文件', async ({ workDir }) => {
              // 切换指定工作目录  
            process.chdir(path.resolve(workDir!));

            // 压缩 src 目录 
            await exec.exec('sudo tar', ['-zcvf', 'src.tar.gz', './src']);

            // 查看当前目录
            await exec.exec('pwd');
            // 查看当前目录下的文件
            await exec.exec('ls', ['-l', './']);
  
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
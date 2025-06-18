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
        await this.groupWrapper(inputs, '压缩目录或文件', async ({ workDir, compressedName, needDir, format }) => {
              // 切换指定工作目录  
            process.chdir(path.resolve(workDir!));

            // 压缩 src 目录 
            // const compressedName = 'archive';  // 压缩之后的文件名， 不带后缀
            // const needDir = './src';  // 需要被压缩的目录， 多个使用空格分开

            const formatMap: Map<string, string> = new Map([
                ['tar.gz', 'tar -zcvf'],
                ['rar', 'rar a'],
                ['zip', 'zip -r']
            ]);

            // 查看当前目录
            // 压缩格式
            // const format = 'tar.gz';
            await exec.exec('sudo ' + formatMap.get(format!) , [`${compressedName}.${format}`, needDir!]);

            // 查看当前目录
            await exec.exec('pwd');
            // du -sh
            await exec.exec('du', ['-sh', needDir!]);
            // 查看当前目录下的文件
            await exec.exec('ls', ['-lh', './']);
  
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
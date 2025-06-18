import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    URL_TEMPLATE = 'https://services.gradle.org/distributions-snapshots/gradle-<VERSION>-<TIMESTAMP>+0000-bin.zip';

    gradleVersionMap: Map<string, string> = new Map([
        ['9.1.0', '20250616002551'],
        ['9.0.0', '20250615010750'],
        ['8.14.2', '20250614045138'],
        ['7.6.5', '20250614030244'],
        ['7.6.4', '20250526080545']
    ]);


    async build(inputs: Partial<InputParamsType>) {
        const title = `build： ${JSON.stringify(inputs)} ` ;
        await this.groupWrapper(inputs, title, async ({ workDir, buildCmd, skipTest, otherParams }) => {
            // 切换指定工作目录  
            process.chdir(path.resolve(workDir!));
            // 组装参数
            const params = ['clean', buildCmd!];
            // 跳过测试
            if (skipTest) {
                params.push('-x');
                params.push('test');
            }
            // 补充参数
            if (otherParams && otherParams.trim() !== '') {
                // 任意多个空格分隔
                const otherArr = otherParams.split(/\s+/);
                params.push(...otherArr);
            }
            // 查看参数
            core.info(`gradle// ${params.join(' ')}`);
            // 执行构建
            await exec.exec('gradle', params);
        });
    };

    // step1. 查看
    async see(inputs: Partial<InputParamsType>) {
        await this.groupWrapper(inputs, '查看当前目录', async ({ workDir }) => {
              // 切换指定工作目录  
            process.chdir(path.resolve(workDir!));
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
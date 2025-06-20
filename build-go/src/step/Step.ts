import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    PROXY_URL = 'https://goproxy.cn,direct' ;

    async configProxy(inputs: Partial<InputParamsType>) {
        const title = `配置代理： ${JSON.stringify(inputs)} ` ;
        await this.groupWrapper(inputs, title, async ({ }) => {
            // 配置代理
            await exec.exec('go', [ 'env', '-w', 'GOPROXY=' + this.PROXY_URL ]);
            // 查看代理
            await exec.exec('go', ['env', '|', 'grep', 'GOPROXY']);
        });
    };


    
    async build(inputs: Partial<InputParamsType>) {
        const title = `构建： ${JSON.stringify(inputs)} ` ;
        await this.groupWrapper(inputs, title, async ({ workDir }) => {
            // 切换目录
            process.chdir(path.resolve(workDir!));
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
    };

    // step1. 查看
    async see(inputs: Partial<InputParamsType>) {
        await this.groupWrapper(inputs, '查看当前目录', async ({ workDir }) => {
              // 切换指定工作目录  
            process.chdir(path.resolve('./'));
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
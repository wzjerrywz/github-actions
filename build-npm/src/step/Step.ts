import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {


    async go() {
        await this.npmVersion({ npmVersion: '9.11' });
    }


    async npmVersion(inputs: Partial<InputParamsType>) {
        const title = ` 设置 npm 版本 ： ${inputs.npmVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ npmVersion }) => {
            await exec.exec('npm', [ INSTALL, '-g', `npm@${npmVersion}`]);
        });
    };


    async nrmInstall(inputs: Partial<InputParamsType>) {
        const title = ` 安装 nrm ： ${inputs.nrmVersion}  ， 指定镜像： ${inputs.nrmSpeed} ` ;
        await this.groupWrapper(inputs, title, async ({ nrmVersion, nrmSpeed }) => {
              await exec.exec('npm', [ INSTALL , '-g', `nrm@${nrmVersion}` ]);
              // nrm add company-registry https://registry.your-company.com
              const nrmMap: Map<string, string> = new Map([
                ['company1', 'https://registry.your-company-01.com'],
                ['company2', 'https://registry.your-company-02.com'],
                ['company3', 'https://registry.your-company-03.com']
              ]);
              // 添加 nrm
              nrmMap.forEach(async (value, key) => {
                await exec.exec('nrm', ['add', key, value]);
              });
              // 配置 nrm
              await exec.exec('nrm', ['use', nrmSpeed!]);
        });
    };


    async projectInstall(inputs: Partial<InputParamsType>) {
        const title = ` 项目安装依赖 ： npm install ` ;
        await this.groupWrapper(inputs, title, async ({ projectPath }) => {
            // 切换到项目目录
            process.chdir(path.resolve(projectPath!));
            // 安装依赖
            await exec.exec('npm', [ INSTALL ]);
        });
    };


    async build(inputs: Partial<InputParamsType>) {
        const title = ` 项目打包 ： npm run ${inputs.buildCommand} ` ;
        await this.groupWrapper(inputs, title, async ({ projectPath, buildCommand }) => {
            // 项目打包
            await exec.exec('npm', [ 'run', buildCommand! ]);
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
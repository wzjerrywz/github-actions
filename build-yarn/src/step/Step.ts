import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    COMPANY_REGISTRY = 'https://registry.npmmirror.com' ;

    async yarnVersion(inputs: Partial<InputParamsType>) {
        const title = ` 安装 yarn 版本 ： ${inputs.yarnVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ yarnVersion }) => {
            await exec.exec('npm', [ INSTALL, '-g', `yarn@${yarnVersion}`]);
        });
    };


    async configRegistry(inputs: Partial<InputParamsType>) {
        const title = ` 配置 yarn 镜像源 ： ${this.COMPANY_REGISTRY}  ` ;
        await this.groupWrapper(inputs, title, async ({  }) => {
              await exec.exec('yarn', [ 'config' , 'set', 'registry', this.COMPANY_REGISTRY ]);
        });
    };


    async projectInstall(inputs: Partial<InputParamsType>) {
        const title = ` 项目安装依赖 ： yarn install ` ;
        await this.groupWrapper(inputs, title, async ({ projectPath }) => {
            // 切换到项目目录
            process.chdir(path.resolve(projectPath!));
            // 安装依赖
            await exec.exec('yarn', [ INSTALL ]);
        });
    };


    async build(inputs: Partial<InputParamsType>) {
        // clean
        await exec.exec('yarn', ['clean']);
        // build
        const title = ` 项目打包 ： yarn  ${inputs.buildCommand} ` ;
        await this.groupWrapper(inputs, title, async ({ projectPath, buildCommand }) => {
            // 项目打包
            await exec.exec('yarn', [ buildCommand! ]);
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
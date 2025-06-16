import { InputParamsType } from "../types/InputParamsType";

import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    // step1. 安装 git 
    async installGit(inputs: Partial<InputParamsType>) {
        const title = `安装git软件： apt-get install -y git` ;
        await this.groupWrapper(inputs, title, async (inputs) => {
                core.info(`${inputs.repoName!}`);
                // 安装 git
                await exec.exec('sudo', ['apt-get', INSTALL, '-y', 'git']);
                // 验证安装是否成功
                await exec.exec('git', [__VERSION]);
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
import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    async npmVersion(inputs: Partial<InputParamsType>) {
        const title = ` 设置 npm 版本 ： ${inputs.npmVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ npmVersion }) => {
            await exec.exec('npm', [ INSTALL, '-g', `npm@${npmVersion}`]);
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
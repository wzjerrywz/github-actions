import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {


    async envNameTest(inputs: Partial<InputParamsType>) {
        const title = ` 查看 env : ${inputs.envName}  jdUser: ${inputs.jdUser} ` ;
        await this.groupWrapper(inputs, title, async ({ envName }) => {
            core.info(JSON.stringify(process.env));
            core.info(process.env['hello'] || 'null');
            const env = process.env['hello']![envName as any];
            core.info(`env vars  :   ${env}`);
            core.info(`jdUser  :   ${inputs.jdUser}`);
            core.setOutput('report', env || 'null');
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
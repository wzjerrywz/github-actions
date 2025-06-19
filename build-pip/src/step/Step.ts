import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

 

    async pipValidateVersion(inputs: Partial<InputParamsType>) {
        const title = ` 验证 pip 版本 ： ${inputs.pipVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
                // 验证
                //  验证 Python 安装
                await exec.exec(`conda run -n ${virtualEnv} python`, [ __VERSION ]);
                await exec.exec(`conda run -n ${virtualEnv} pip`, [ __VERSION ]);
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
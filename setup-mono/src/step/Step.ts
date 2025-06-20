import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { Const } from '../common/Const';
const { __VERSION} = Const;


export class Step {

    inputs: Partial<InputParamsType> ;

    constructor(inputs: Partial<InputParamsType>) {
        this.inputs = inputs;
    }

    async go() {
        await this.configRepo();
    }

    async configRepo() {
        const title = `配置 mono 源： ${this.inputs.monoVersion!}` ;
        await this.groupWrapper(title, async () => {
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
    }

    // 组装函数
    async  groupWrapper(title: string, fn: () => Promise<void>) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn();
        // end group
        core.endGroup();
    };


}
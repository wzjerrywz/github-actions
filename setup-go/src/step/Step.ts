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


    // step1. 下载 go
    async downloadGo(inputs: Partial<InputParamsType>) {
        const title = `下载 go , 版本号：${inputs.goVersion!}` ;
        await this.groupWrapper(inputs, title, async ({ goVersion, installPath }) => {
            // 创建目录 process.env.OS
            core.info("process: \n")
            core.info(JSON.stringify(process));
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
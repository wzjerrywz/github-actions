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

    // step1. 下载 gradle
    async downloadGradle(inputs: Partial<InputParamsType>) {
        const title = `下载 gradle , 版本号：` ;
        await this.groupWrapper(inputs, title, async ({ }) => {
              
        });
    };


    // step2. 解压并配置环境变量
    async tarForEnv(inputs: Partial<InputParamsType>) {
        const title = `解压并配置环境变量` ;
        await this.groupWrapper(inputs, title, async ({  }) => {
              
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
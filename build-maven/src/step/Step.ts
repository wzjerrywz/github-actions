import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL, _VERSION } = Const;

const { info } = core;

export class Step {

    inputs: Partial<InputParamsType> | unknown ;


    constructor() {
        this.validInputs();
    }

    // 整个流程
    async go() {
        await this.pkg();
        await this.see();
    }



     // mvn clean package -DskipTests=true
     async pkg() {
        const { workDir , skipTest } = this.inputs as InputParamsType;
        await this.groupWrapper(` mvn clean package -DskipTests=${skipTest} `,  async () => {
            // 切换目录
            process.chdir(workDir);
            // 执行命令
            await exec.exec(`mvn`, ['clean', 'package', `-DskipTests=${skipTest}`]);
        });
    }

     // 查看
     async see() {
        await this.groupWrapper(` 查看 `,  async () => {
            await exec.exec(`pwd`);
            await exec.exec(`ls -l ./`);
            await exec.exec(`ls -l ./target`);
        });
    }

    validInputs() {
        // 获取输入参数
        this.inputs = {
            workDir: core.getInput('work-dir', { required: true }),
            skipTest: core.getInput('skip-test', { required: true }),
        } ;
        // 验证输入参数
        core.info('validInputs() is ok 。');
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
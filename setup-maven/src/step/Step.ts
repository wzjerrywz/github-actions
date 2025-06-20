import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL, VERSION } = Const;

const { log } = console;

export class Step {

    inputs: Partial<InputParamsType> | unknown ;

    bigVersion = '3';

    URL_TEMPLATE = 'https://archive.apache.org/dist/maven/maven-<PREFIX>/<VERSION>/binaries/apache-maven-<VERSION>-bin.tar.gz' ;

    constructor() {
        this.validInputs();
    }

    // 整个流程
    async go() {
        await this.download();
        await this.see();
    }

    // 下载
    async download() {
        const { mavenVersion } = this.inputs as InputParamsType;
        await this.groupWrapper(` 下载 maven , 版本号 ${mavenVersion} `,  async () => {
            const url = this.URL_TEMPLATE
                            .replaceAll('<PREFIX>', this.bigVersion)
                            .replaceAll('<VERSION>', mavenVersion);
            await tc.downloadTool(url, path.resolve("./soft/maven", `mvn${mavenVersion}.tar.gz`));
        });
    }

    // 查看
    async see() {
        const { mavenVersion } = this.inputs as InputParamsType;
        await this.groupWrapper(` 查看 `,  async () => {
            await exec.exec(`ls -l ./soft/maven`);
        });
    }


    validInputs() {
        // 获取输入参数
        this.inputs = {
            mavenVersion: core.getInput('maven-version', { required: true }),
            installPath: core.getInput('install-path', { required: true }),
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
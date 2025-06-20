import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';


import { Const } from '../common/Const';
const { __VERSION} = Const;


export class Step {

    DOWNLOAD_URL = 'https://download.mono-project.com/sources/mono/mono-<VERSION>.tar.xz' ;

    inputs: Partial<InputParamsType> ;

    constructor(inputs: Partial<InputParamsType>) {
        this.inputs = inputs;
    }

    async go() {
        await this.configRepo();
        await this.downloadMono();
        await this.extract();
    }

    async configRepo() {
        const title = `配置 mono 源： ${this.inputs.monoVersion!}` ;
        await this.groupWrapper(title, async () => {
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
    }

    async downloadMono() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`下载 mono ： ${monoVersion}`,  async () => {
                const url = this.DOWNLOAD_URL.replaceAll('<VERSION>', monoVersion!);
                await tc.downloadTool(url, path.resolve("./soft/mono"!, `mono-${monoVersion!}.tar.xz`));
                //
                process.chdir(path.resolve("./soft/mono", ``));
                await exec.exec('ls -l ./');
                await exec.exec('pwd');
        });
    }


    // 解压
    async extract() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`下载 mono ： ${monoVersion}`,  async () => {
                const name = `mono-${monoVersion!}.tar.xz`
                await exec.exec(`tar -xvf ${name} -C ./`);
                //
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
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
        await this.download();
        await this.tar();
        await this.env();
        await this.see();   
    }

    async download() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`下载 版本：  ${monoVersion} `,  async () => {
                const url = this.DOWNLOAD_URL.replaceAll('<VERSION>', monoVersion!);
                await exec.exec(`curl -L -o mono-${monoVersion!}.tar.xz  ` + url);
        });
    }


    // 解压
    async tar() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`解压  ： .tar.xz `,  async () => {
                // 解压
                await exec.exec(`tar -xf mono-${monoVersion!}.tar.xz -C ./`);
        });
    }

    // 配置环境变量
    async env() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`配置环境变量`,  async () => {
                const monoHome = path.resolve(`./mono-${monoVersion!}`);
                const binDir = path.join( monoHome, 'bin');
                core.addPath(binDir);
                // export
                core.exportVariable('MONO_HOME', monoHome);
                // info
                core.info(`Mono added to PATH: ${binDir}`);
        });
    }

      // 查看版本
      async see() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`查看版本`,  async () => {
                await exec.exec('mono', [__VERSION]);
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
import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { Const } from '../common/Const';
const { __VERSION} = Const;


export class Step {

    // step1. 配置 mono 源
    async configRepo(inputs: Partial<InputParamsType>) {
        const title = `配置 mono 源：${inputs.monoVersion!}` ;
        await this.groupWrapper(inputs, title, async ({ monoVersion }) => {
            // const cmd1 = URL_1.replaceAll('<KEY_SERVER>', KEY_SERVER)
            //                    .replaceAll('<RECV_KEYS>', RECV_KEYS);
            // const cmd2 = URL_2.replaceAll('<DOWNLOAD_URL>', DOWNLOAD_URL)
            //                    .replaceAll('<MONO_VERSION>', monoVersion!)
            //                    .replaceAll('<ETC_CONFIG>', ETC_CONFIG);
            // // 执行
            // await exec.exec(cmd1);
            // await exec.exec(cmd2);
            // update
            const list = [
                'sudo apt update && sudo apt upgrade -y',
                'sudo apt install -y build-essential autoconf automake libtool bison pkg-config',
                'sudo apt install -y libgdiplus libc6-dev'
            ] ;
            // 执行
            list.forEach(async (item) => {
                await exec.exec(item);
            });

        });
    };


        // step2. 安装 mono 
        async install(inputs: Partial<InputParamsType>) {
            const title = `安装 mono : ${inputs.monoVersion!}` ;
            await this.groupWrapper(inputs, title, async ({ monoVersion }) => {
                // 安装 Mono
                // sudo apt install -y mono-complete=6.12.0.122*
                // const params = [ INSTALL , '-y', `mono-complete=${monoVersion!}*`];
                // await exec.exec('sudo apt', params);
                const list = [ 'ls -l ./'   ] ;
                // 执行
                list.forEach(async (item) => {
                    await exec.exec(item);
                });
            });
        };

        // step3. 查看 mono 版本
        async checkVersion(inputs: Partial<InputParamsType>) {
            const title = `查看 mono 版本` ;
            await this.groupWrapper(inputs, title, async ({  }) => {
                await exec.exec('ls -l ./');
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
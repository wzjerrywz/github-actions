import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL, VERSION } = Const;

export class Step {

    URL_TEMPLATE = 'https://go.dev/dl/go<VERSION>.linux-amd64.tar.gz';


    // step1. 下载 go
    async downloadGo(inputs: Partial<InputParamsType>) {
        const title = `下载 go , 版本号：${inputs.goVersion!}` ;
        await this.groupWrapper(inputs, title, async ({ goVersion, installPath }) => {
            // 创建目录
            await exec.exec(`sudo mkdir -p ${installPath!}`);
            // 目录授权
            await exec.exec(`sudo chmod -R 777 ${installPath!}`);
            // 下载 go
            const url = this.URL_TEMPLATE.replaceAll('<VERSION>', goVersion!);
            await tc.downloadTool(url, path.resolve(installPath!, `go-${goVersion!}.tar.gz`));
 
            // 查看
            await exec.exec('ls', ['-l', installPath!]);
        });
    };


        // step2. 解压并配置环境变量
        async tarForEnv(inputs: Partial<InputParamsType>) {
            const title = `解压并配置环境变量` ;
            await this.groupWrapper(inputs, title, async ({ goVersion, installPath }) => {
                  const tarName = `go-${goVersion!}.tar.gz` ;
                  process.chdir(`${path.resolve(installPath!)}`);
                  await exec.exec(`sudo tar -zxvf ${tarName} -C ./ `);
                  // 配置环境变量
                  const goHome = path.resolve('./', `go`);
                  core.info(`goHome: ${goHome}`);
                  core.exportVariable('GO_HOME', goHome);
                  // 设置 outputs
                  core.setOutput('go-home', goHome);
                  // path
                  core.addPath(path.join(goHome, 'bin'));
            });
        };

        // step3. 查看 go 版本
        async checkGoVersion(inputs: Partial<InputParamsType>) {
            const title = `查看 go 版本` ;
            await this.groupWrapper(inputs, title, async ({ goVersion, installPath }) => {
                await exec.exec('go', [VERSION]);
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
import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    URL_TEMPLATE = 'https://download.java.net/java/GA/jdk<VERSION>/<SIGNURE>/GPL/openjdk-<VERSION>_linux-x64_bin.tar.gz';

    jdkVersionMap: Map<string, string> = new Map([
        ['17.0.2', 'dfd4a8d0985749f896bed50d7138ee7f/8'],
        ['18.0.2', 'f6ad4b4450fd4d298113270ec84f30ee/9'],
        ['19.0.1', 'afdd2e245b014143b62ccb916125e3ce/10'],
        ['20.0.2', '6e380f22cbe7469fa75fb448bd903d8e/9'],
        ['21.0.2', 'f2283984656d49d69e91c558476027ac/13'],
        ['22.0.2', 'c9ecb94cd31b495da20a27d4581645e8/9'],
        ['23.0.2', '6da2a6609d6e406f85c491fcb119101b/7'],
        ['24', '1f9ff9062db4449d8ca828c504ffae90/36']
      ]);

    // step1. 下载 jdk
    async downloadJdk(inputs: Partial<InputParamsType>) {
        const title = `下载 jdk , 版本号：${inputs.jdkVersion!}` ;
        await this.groupWrapper(inputs, title, async ({ jdkVersion, installPath }) => {
              const signature = this.jdkVersionMap.get(jdkVersion!);
              const url = this.URL_TEMPLATE.replaceAll('<VERSION>', jdkVersion!)
                                      .replaceAll('<SIGNURE>', signature!);
              // 目录授权
              child_process.execSync(`chmod -R 777 ${installPath!}`);
              // 下载
              const tarName = `openjdk-${jdkVersion!}_linux-x64_bin.tar.gz` ;
              await tc.downloadTool(url, path.resolve(installPath!, tarName));
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
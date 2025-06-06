import { InputParamsType } from "../types/InputParamsType";

import * as core from '@actions/core'

import * as exec from '@actions/exec'

// step1. 安装 git 
export async function installGit(inputs: Partial<InputParamsType>) {
    // 安装 git
    core.startGroup(`安装git ,  版本: ${inputs.gitVersion}`);
    await exec.exec('sudo', ['apt-get', 'install', '-y', 'git']);
    core.endGroup();
    // 验证安装是否成功
    await exec.exec('git', ['--version']);
}


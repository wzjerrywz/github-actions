import { InputParamsType } from "../types/InputParamsType";

import * as core from '@actions/core'

import * as exec from '@actions/exec'

// step1. 安装 git 
export async function installGit(inputs: Partial<InputParamsType>) {
    // 安装 git
    core.startGroup(`安装git软件： apt-get install -y git`);
    await exec.exec('sudo', ['apt-get', 'install', '-y', 'git']);
    core.endGroup();
    // 验证安装是否成功
    await exec.exec('git', ['--version']);
}

// step2. git clone
export async function gitClone(inputs: Partial<InputParamsType>) {
    const url =  `https://oauth2:${inputs.token}@gitee.com/${inputs.owner}/${inputs.projectName}.git` ;
    core.startGroup(` git clone -b ${inputs.branchName} ${url} `);
    
    await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, url]) ;
    core.endGroup();
    // 验证安装是否成功
    await exec.exec('ls', ['-l', './']);
}


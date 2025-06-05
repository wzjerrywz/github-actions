import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as exec from '@actions/exec'

import {  getText } from './common/cmd';

import path from 'path'
import os from 'os'

type InputParams = {
  gitVersion: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.gitVersion) throw new Error('gitVersion input is required') ;
  return params as InputParams
}


async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
          gitVersion: core.getInput('git-version', { required: true })
    })
    const gitDownloadUrl = `https://www.kernel.org/pub/software/scm/git/git-${inputs.gitVersion}.tar.gz` ;

    // 下载 git.tar.gz
    core.startGroup(`下载 git.tar.gz ,  版本: ${inputs.gitVersion}`);
    const gitFilePath = await tc.downloadTool(gitDownloadUrl, './soft/git.tar.gz');
    core.info(`git  ${inputs.gitVersion} 安装程序已下载到 :   ./soft/git.tar.gz `);
    // 解压
    const gitDir = await tc.extractTar(gitFilePath, './soft/');
    core.info(`git  ${inputs.gitVersion} 安装程序已解压到 :  ${gitDir} `);
    
    await exec.exec(`ls -l ${gitDir}`, []);
    core.endGroup();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

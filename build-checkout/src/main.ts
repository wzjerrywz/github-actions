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

    // 安装 git
    await exec.exec('sudo apt-cache madison git', []);
    core.startGroup(`安装git ,  版本: ${inputs.gitVersion}`);
    await exec.exec('sudo', ['apt-get', 'install', '-y', 'git']);

    await exec.exec('git', ['--version']);
    
    core.endGroup();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

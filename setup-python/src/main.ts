import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as exec from '@actions/exec'

import {  getText } from '@common/cmd';

import path from 'path'
import os from 'os'

type InputParams = {
  nvmVersion: string,
  nodejsVersion: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.nvmVersion) throw new Error('nvmVersion input is required') ;
  if (!params.nodejsVersion) throw new Error('nodejsVersion input is required') ;
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    // const inputs = validateInputs({
    //   nvmVersion: core.getInput('nvm-version', { required: true }),
    //   nodejsVersion: core.getInput('nodejs-version', { required: true }),
    // })

    const condaVersion = 'py39_25.3.1-1'
    const condaUrl = `https://repo.anaconda.com/miniconda/Miniconda3-${condaVersion}-Linux-x86_64.sh` ;
    // 下载 Conda 安装程序
    core.startGroup('下载 Conda 安装程序');
    const soft = './soft/conda';
    const condaInstallerPath = await tc.downloadTool(condaUrl, soft);
    core.info(`Conda  ${condaVersion} 安装程序已下载到: ${condaInstallerPath}`);
    core.endGroup();

    // 安装 Conda
    core.startGroup('安装 Conda');
    const condaDir = path.join(os.homedir(), 'miniconda3');
    await exec.exec('bash', [
      condaInstallerPath,
      '-b',
      '-p', 
      condaDir
    ]);
   // 验证 Conda 安装
   await exec.exec('conda', ['--version']);
   
  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

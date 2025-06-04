import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as exec from '@actions/exec'

import {  getText } from './common/cmd';

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
    core.startGroup('下载 Conda 安装程序 ,  版本: ${condaVersion}');
    const soft = 'soft/conda.sh';
    const condaInstallerPath = await tc.downloadTool(condaUrl, './' + soft);
    core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
    const nowdir = await getText('pwd', []);
    core.info(`当前目录 nowdir : ${nowdir}`);
    await exec.exec('ls', ['-l', nowdir + '/' + soft]);
    core.endGroup();

    // 安装 Conda
    core.startGroup('安装 Conda');
    const down = await getText('pwd', []) + '/' + soft;
    const condaDir = path.join(os.homedir(), 'miniconda3');
    await exec.exec('bash', [
      down,
      '-b',
      '-p', 
      condaDir
    ]);
   // 验证 Conda 安装
   await exec.exec('conda', ['--version']);
   

   const pythonVersion = '3.9.18' ;
 // 创建环境并安装指定版本的 Python
    core.startGroup(`创建 Conda 环境并安装 Python ${pythonVersion}`);
    const envName = 'github_actions_env';
    await exec.exec('conda', [
      'create',
      '-y',
      '-n', 
      envName,
      `python=${pythonVersion}`
    ]);
    core.info(`Python ${pythonVersion} 已安装到环境 ${envName}`);
    core.endGroup();

    // conda list 查看环境
    await exec.exec('conda', [
      'activate',
      'github_actions_env'
    ]);

    // 验证 Python 安装
    await exec.exec('python', ['--version']);
    await exec.exec('pip', ['--version']);
    

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

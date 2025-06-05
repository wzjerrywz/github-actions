import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as exec from '@actions/exec'

import {  getText } from './common/cmd';

import path from 'path'
import os from 'os'

type InputParams = {
  dotnetVersion: string
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.dotnetVersion) throw new Error('dotnetVersion input is required') ;
  return params as InputParams
}


async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
          dotnetVersion: core.getInput('dotnet-version', { required: true })
    })

    const url = 'https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb';

    core.startGroup(`下载安装 dotnet ,  版本: ${inputs.dotnetVersion} `);
    const soft = 'packages-microsoft-prod.deb';
    const installerPath = await tc.downloadTool(url, './' + soft);
    core.info(` dotnet  ${inputs.dotnetVersion} 安装程序已下载到 :   ${installerPath}`);

    // 
    await exec.exec(`sudo dpkg -i ${soft} `, []);
    await exec.exec(`rm ${soft}`, []);
    await exec.exec(`sudo apt-get update`, []);
    await exec.exec(`sudo apt-get install -y apt-transport-https `, []);
    core.info(` dotnet  ${inputs.dotnetVersion} 安装完成 `);
    core.endGroup();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

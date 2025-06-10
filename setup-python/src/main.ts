import * as core from '@actions/core'

import * as exec from '@actions/exec'

import { downloadConda, configConda, createVirtualEnv , activateEnv, validVersion } from './step/Step';

type InputParams = {
  condaVersion: string,
  pythonVersion: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      condaVersion: core.getInput('conda-version', { required: true }),
      pythonVersion: core.getInput('python-version', { required: true }),
    })
    console.log(inputs);

    // step1 下载安装包
    await downloadConda();

    // step2 安装 nvm
    await configConda();
   
    // step3. 创建虚拟环境
    await createVirtualEnv();
   
    // step4. 激活虚拟环境
    await activateEnv();

    // step5. 验证版本
    await validVersion();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run() ;

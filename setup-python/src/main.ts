import * as core from '@actions/core'

import * as exec from '@actions/exec'

import { downloadConda, configConda, createVirtualEnv } from './step/Step';

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

    // step1 下载安装包
    await downloadConda();

    // step2 安装 nvm
    await configConda();
   
    // step3. 创建虚拟环境
    await createVirtualEnv();
   
    const envName = 'github_actions_env';
  
    
    console.log('验证! 版本：\n');

   // 验证 Python 安装
    await exec.exec(`conda run -n ${envName} python --version`, [ ]);
    await exec.exec(`conda run -n ${envName} pip --version`, [ ]);


  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

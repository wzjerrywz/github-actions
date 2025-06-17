import * as core from '@actions/core'
import * as path from 'path';
import * as exec from '@actions/exec';

import { InputParamsType } from './types/InputParamsType';

import { Step } from './step/Step';


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
      return params as InputParamsType ;
}


export async function run(): Promise<void> {
  try {
    // 验证输入
    const inputs = validateInputs({
      jdkVersion: core.getInput('jdk-version', { required: true }),
      installPath: core.getInput('install-path', { required: true }),
    }) ;

    const step = new Step();
    await step.downloadJdk(inputs) ;
    await step.tarForEnv(inputs) ;

    // 查看安装路径
    const jdkPath = path.resolve(inputs.installPath!);
    console.log(`jdkPath: ${jdkPath}`);
    await exec.exec('ls', ['-l', jdkPath]);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

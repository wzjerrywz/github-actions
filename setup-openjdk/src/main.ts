import * as core from '@actions/core'
import * as path from 'path';
import * as exec from '@actions/exec';

import { InputParamsType } from './types/InputParamsType';

import { Step } from './step/Step';

import { Const } from './common/Const';

const { _VERSION, INSTALL } = Const;

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
    await exec.exec('java', [_VERSION]);


  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

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
      gradleVersion: core.getInput('gradle-version', { required: true }),
      installPath: core.getInput('install-path', { required: true }),
    }) ;

    const step = new Step();
    await step.downloadGradle(inputs) ;
    await step.tarForEnv(inputs) ;


    // 查看版本
    await exec.exec('gradle', ['-v']);
    // 查看 jdk 版本
    await exec.exec('java', [_VERSION]);

   

    // await exec.exec('ls', ['-l', './demo-gradle-groovy-build']);
    const hello = '/home/runner/work/myts-action/myts-action';

    await exec.exec('ls', ['-l', hello]);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

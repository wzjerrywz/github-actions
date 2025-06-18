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
        workDir: core.getInput('work-dir', { required: true }),
        buildCmd: core.getInput('build-cmd', { required: true }),
    }) ;

    const step = new Step();
   
    // 
    process.chdir(path.resolve(inputs.workDir));

    // 查看当前目录
    await exec.exec('pwd');

    // 查看当前目录下的文件
    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

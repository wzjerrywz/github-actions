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
        outFile: core.getInput('out-file', { required: true }),
    }) ;

    const step = new Step();
    await step.configProxy(inputs);
    await step.build(inputs);
    await step.see(inputs);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

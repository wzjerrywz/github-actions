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
        skipTest: Boolean(core.getInput('skip-test', { required: true })),
        otherParams: core.getInput('other-params', { required: false }),
    }) ;

    const step = new Step();
    await step.build(inputs);
    await step.see(inputs);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

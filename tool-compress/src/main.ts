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
        compressedName: core.getInput('compressed-name', { required: true }),
        needDir: core.getInput('need-dir', { required: true }),
        format: core.getInput('format', { required: true }),
    }) ;

    const step = new Step();
    await step.compress(inputs);

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

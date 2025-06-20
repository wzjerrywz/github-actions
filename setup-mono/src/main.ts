import * as core from '@actions/core'

import { InputParamsType } from './types/InputParamsType';

import { Step } from './step/Step';

import { Const } from './common/Const';


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
      return params as InputParamsType ;
}


export async function run(): Promise<void> {
  try {
    // 验证输入
    const inputs = validateInputs({
           monoVersion: core.getInput('mono-version', { required: true })
    }) ;

    await new Step(inputs).go();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

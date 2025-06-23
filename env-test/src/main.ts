import * as core from '@actions/core';

import * as exec from '@actions/exec';

import { InputParamsType } from './types/InputParamsType';
import { Step } from './step/Step';
import path from 'path';


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
  return params as InputParamsType
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      envName: core.getInput('env-name', { required: true }),
      jdUser: core.getInput('jd-user', { required: true })
    }) ;



    const step = new Step();
    await step.envNameTest(inputs);


  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

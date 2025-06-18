 import * as core from '@actions/core'

import * as exec from '@actions/exec'
import { Step } from './step/Step';
import { InputParamsType } from './type/InputParamsType';


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
  if (!params.nvmVersion) throw new Error('nvmVersion input is required') ;
  if (!params.nodejsVersion) throw new Error('nodejsVersion input is required') ;
  return params as InputParamsType
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      nvmVersion: core.getInput('nvm-version', { required: true }),
      nodejsVersion: core.getInput('nodejs-version', { required: true }),
    })

    const step = new Step();
    await step.installNvm(inputs);
    await step.installNodejs(inputs);

    // 查看 node 版本
    await exec.exec('node', ['-v']);
    
  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

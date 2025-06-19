import * as core from '@actions/core'

import * as exec from '@actions/exec'
import { InputParamsType } from './types/InputParamsType';
import { Step } from './step/Step';
import { Const } from './common/Const';

const { __VERSION } = Const;

function validateInputs(params: Partial<InputParamsType>): InputParamsType {
  return params as InputParamsType
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      virtualEnv: core.getInput('virtual-env', { required: true }),
      pipVersion: core.getInput('pip-version', { required: true }),
    })
    console.log("inputs: ", inputs);

    // steps
    const step = new Step();
    await step.registerSpeedup(inputs);
    await step.pipVersionInstall(inputs);
    await step.projectSetup(inputs);

    // 验证 conda 版本
    await exec.exec(`conda run -n ${inputs.virtualEnv} pip`, [ __VERSION ]);


  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run() ;

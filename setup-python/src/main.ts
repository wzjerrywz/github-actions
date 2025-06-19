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
      condaVersion: core.getInput('conda-version', { required: true }),
      pythonVersion: core.getInput('python-version', { required: true }),
      virtualEnv: core.getInput('virtual-env', { required: true }),
    })
    console.log("inputs: ", inputs);

    // steps
    const step = new Step();
    await step.condaDownload(inputs);
    await step.condaConfigPath(inputs);
    await step.pythonCreateEnv(inputs);
    await step.pythonValidateVersion(inputs);

    // 验证 conda 版本
    await exec.exec(`conda`, [ __VERSION ]);


  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run() ;

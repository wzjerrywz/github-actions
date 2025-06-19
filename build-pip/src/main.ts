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
      pkgMode: core.getInput('pkg-mode', { required: true }),
      workDir: core.getInput('work-dir', { required: true }),
      requireFile: core.getInput('require-file', { required: true }),
    })
    console.log("inputs: ", inputs);

    // steps
    const step = new Step();
    await step.registerSpeedup(inputs);
    await step.pipVersionInstall(inputs);

    // 根据打包方式执行不同的步骤
    switch (inputs.pkgMode) {
      case 'setup':
        await step.projectSetup(inputs);
        break;
      case 'build':
        await step.projectBuild(inputs);
        break;
      case 'pyinstaller':
        await step.projectPyinstaller(inputs);
        break;
    }

    // 验证 conda 版本
    const vvv = `conda run -n ${inputs.virtualEnv} `;
    await exec.exec(`${vvv}pip`, [ __VERSION ]);


  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run() ;

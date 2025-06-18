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
      projectPath: core.getInput('project-path', { required: true }),
      buildCommand: core.getInput('build-command', { required: true }),
      npmVersion: core.getInput('npm-version', { required: true }),
      nrmVersion: core.getInput('nrm-version', { required: true }),
      nrmSpeed: core.getInput('nrm-speed', { required: true }),
    }) ;



    const step = new Step();
    await step.npmVersion(inputs);
    await step.nrmInstall(inputs);
    await step.projectInstall(inputs);
    await step.build(inputs);

    // 查看项目目录
    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

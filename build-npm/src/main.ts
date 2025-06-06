 import * as core from '@actions/core'

import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path from 'path'
import os from 'os'



type InputParams = {
  projectPath: string,
  buildCommand: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      projectPath: core.getInput('project-path', { required: true }),
      buildCommand: core.getInput('build-command', { required: true })
    }) ;

    const nvmDir = path.resolve(inputs.projectPath);
    process.chdir(nvmDir);

   

    await exec.exec('npm', ['run', `${inputs.buildCommand}`]);

    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

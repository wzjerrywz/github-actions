 import * as core from '@actions/core'

import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path from 'path'
import os from 'os'



type InputParams = {
  projectPath: string
}

function validateInputs(params: Partial<InputParams>): InputParams {
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      projectPath: core.getInput('project-path', { required: true })
    }) ;

    const nvmDir = path.resolve(inputs.projectPath);
    core.info(`projectPath:  ${nvmDir}`);


  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

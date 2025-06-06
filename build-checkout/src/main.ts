import * as core from '@actions/core'

import * as exec from '@actions/exec'
import { InputParamsType } from './types/InputParamsType';

import * as ubuntu from './step/Ubuntu' ;


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
      return params as InputParamsType ;
}


async function run(): Promise<void> {
  try {
    const inputs = validateInputs({
          branchName: core.getInput('branch-name', { required: true }),
          token: core.getInput('token', { required: true }),
          owner: core.getInput('owner', { required: true }),
          projectName: core.getInput('project-name', { required: true }),
    }) ;
    await ubuntu.installGit(inputs) ;

    //
    await ubuntu.gitClone(inputs) ;

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

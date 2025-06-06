import * as core from '@actions/core'

import * as exec from '@actions/exec'
import { InputParamsType } from './types/InputParamsType';

import * as ubuntu from './step/Ubuntu' ;


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
      if (!params.gitVersion) throw new Error('gitVersion input is required') ;
      return params as InputParamsType ;
}


async function run(): Promise<void> {
  try {
    const inputs = validateInputs({
          gitVersion: core.getInput('git-version', { required: true })
    }) ;
    await ubuntu.installGit(inputs) ;
  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

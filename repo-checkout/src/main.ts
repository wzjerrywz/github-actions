import * as core from '@actions/core'

import { InputParamsType } from './types/InputParamsType';



import { Step } from './step/Step';


function validateInputs(params: Partial<InputParamsType>): InputParamsType {
      return params as InputParamsType ;
}


export async function run(): Promise<void> {
  try {
    // 验证输入
    const inputs = validateInputs({
      branchName: core.getInput('branch-name', { required: true }),
      repoName: core.getInput('repo-name', { required: true }),
    }) ;

    const [owner, repo] = inputs.repoName.split('/');
    console.log(`owner: ${owner}, repo: ${repo}`);

    const step = new Step();
    await step.installGit(inputs) ;

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

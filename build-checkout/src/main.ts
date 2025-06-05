import * as core from '@actions/core'

import * as exec from '@actions/exec'

type InputParams = {
  gitVersion: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.gitVersion) throw new Error('gitVersion input is required') ;
  return params as InputParams
}


async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
          gitVersion: core.getInput('git-version', { required: true })
    })

    // 安装 git
    await exec.exec('sudo apt-cache madison git', []);
    core.startGroup(`安装git ,  版本: ${inputs.gitVersion}`);
    await exec.exec('sudo', ['apt-get', 'install', '-y', 'git']);
    core.endGroup();

    await exec.exec('git', ['--version']);
    
    core.endGroup();

  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
}


// run
run()

import * as core from '@actions/core';

import * as exec from '@actions/exec';

import { InputParamsType } from './types/InputParamsType';
import { Step } from './step/Step';


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

    // 查看 npm 版本
    await exec.exec('npm', ['-v']);
    // 查看 nrm 配置
    await exec.exec('nrm', ['ls']);

  //  // 安装 nrm

  //  // 配置 nrm
  //  await exec.exec('nrm', ['use', inputs.nrmSpeed]);

  //  // 查看 nrm 配置
  //  await exec.exec('nrm', ['ls']);

  //   const projectPath = path.resolve(inputs.projectPath);

  //   console.log(`projectPath: ${projectPath}`);
  //   process.chdir(projectPath);

  //   await exec.exec('npm', ['install']);
  //   await exec.exec('npm', ['run', `${inputs.buildCommand}`]);

    
  //   await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

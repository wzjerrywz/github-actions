 import * as core from '@actions/core'

 import * as tc from '@actions/tool-cache'

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

    await exec.exec('npm', ['install']);
    await exec.exec('npm', ['run', `${inputs.buildCommand}`]);

    // tc 压缩目录  build  到文件   dist.tar.gz
    // tar -czvf archive.tar.gz mydir
    await exec.exec('tar', ['-czvf', 'build.tar.gz', './build']);
    
    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

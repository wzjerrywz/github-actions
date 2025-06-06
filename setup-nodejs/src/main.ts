 import * as core from '@actions/core'

import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path from 'path'
import os from 'os'



type InputParams = {
  nvmVersion: string,
  nodejsVersion: string,
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.nvmVersion) throw new Error('nvmVersion input is required') ;
  if (!params.nodejsVersion) throw new Error('nodejsVersion input is required') ;
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    const inputs = validateInputs({
      nvmVersion: core.getInput('nvm-version', { required: true }),
      nodejsVersion: core.getInput('nodejs-version', { required: true }),
    })

    const nvmDir = path.join(os.homedir(), '.nvm');
    core.exportVariable('NVM_DIR', nvmDir);

    const nvm = `curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v${inputs.nvmVersion}/install.sh` ;
    await exec.exec(nvm, []);
    await exec.exec('bash', ['install.sh']);

    // 加载 NVM 环境
    await exec.exec('bash', [
      '-c',
      `. ${nvmDir}/nvm.sh && nvm install ${inputs.nodejsVersion} && nvm use ${inputs.nodejsVersion} `
    ]);
    
    // 获取 Node.js 路径并添加到 PATH
    const nodePath = await exec.getExecOutput('bash', [
      '-c',
      `. ${nvmDir}/nvm.sh && dirname $( nvm which ${inputs.nodejsVersion} ) `
    ], {
      silent: true
    });
    console.log(`nodePath: ${nodePath.stdout}`);
    
    const nodeBinPath = path.join(nodePath.stdout.trim(), '');
    core.addPath(nodeBinPath);

    await exec.exec(nodeBinPath + '/' + 'node', ['-v']);

    core.info('###################################################################');

    const textGet = await getText('node', ['-v']);

    core.info(`Node.js Of by GetText:   ` + textGet);

    await exec.exec('node', ['-v']);

    
  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

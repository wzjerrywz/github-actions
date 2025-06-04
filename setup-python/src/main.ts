 import * as core from '@actions/core'

import * as exec from '@actions/exec'

// 由于文件路径问题，调整导入路径到实际文件路径
import {  getText } from '@common/cmd';
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
    
    const nodeBinPath = path.join(nodePath.stdout.trim(), 'bin');
    core.addPath(nodeBinPath);

    const textGet = await getText('node', ['-v']);
    console.log(textGet);
    core.info(`Node.js Of by GetText:   ` + textGet);

    await exec.exec('node', ['-v']);

    // const url = 'https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_linux-x64_bin.tar.gz';

    // await exec.exec('wget', ['-q', url]);

    // await exec.exec('tar', ['-xf', 'openjdk-17_linux-x64_bin.tar.gz', '-C', './']);

    // const jdkHome = await capture('pwd', [])  + '/jdk-17' ;

    // await exec.exec('chmod', ['+x', `${jdkHome}/bin/java`]);


// 设置 JAVA_HOME 环境变量
// core.exportVariable('JAVA_HOME', jdkHome);
  
// 设置其他变量（如 PATH）
// core.exportVariable('PATH', `${jdkHome}/bin:${process.env.PATH}`);


    // await exec.exec('java', ['-version']);

    // await exec.exec('ls', ['./'])

    // await exec.exec('npm', ['i', 'npm@latest'])

  

    core.info(`Processing with: ${JSON.stringify(inputs)}`)
    
    const result = {
      original: inputs,
      processedAt: new Date().toISOString(),
      message: `Received ${inputs.nodejsVersion} with 1 selection`
    }

    core.setOutput('report', JSON.stringify(result))
    core.summary
      .addHeading('Action Results')
      .addTable([
        ['Field', 'Value'],
        ['nodejsVersion', inputs.nodejsVersion]
      ])
      .write()
  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

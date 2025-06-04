 import * as core from '@actions/core'

import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path from 'path'
import os from 'os'



type InputParams = {
  text: string
}

function validateInputs(params: Partial<InputParams>): InputParams {
  if (!params.text) throw new Error('Text input is required')
  return params as InputParams
}

async function run(): Promise<void> {
  try {

    const nvmDir = path.join(os.homedir(), '.nvm');
    core.exportVariable('NVM_DIR', nvmDir);

    const nvm = 'curl -o install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh' ;
    await exec.exec(nvm, []);
    await exec.exec('bash', ['install.sh']);

    // 加载 NVM 环境
    await exec.exec('bash', [
      '-c',
      `. ${nvmDir}/nvm.sh && nvm install 18 && nvm use 18 `
    ]);
    
    // 获取 Node.js 路径并添加到 PATH
    const nodePath = await exec.getExecOutput('bash', [
      '-c',
      `. ${nvmDir}/nvm.sh && dirname $( nvm which 18 ) `
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

    const inputs = validateInputs({
      text: core.getInput('hello-world')
    })

    core.info(`Processing with: ${JSON.stringify(inputs)}`)
    
    const result = {
      original: inputs,
      processedAt: new Date().toISOString(),
      message: `Received ${inputs.text} with 1 selection`
    }

    core.setOutput('report', JSON.stringify(result))
    core.summary
      .addHeading('Action Results')
      .addTable([
        ['Field', 'Value'],
        ['Text', inputs.text]
      ])
      .write()
  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

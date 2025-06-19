import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as exec from '@actions/exec'

import { execFile } from 'child_process';

import path from 'path'
import os from 'os'
import * as fs from 'fs'

export async function downloadConda() {
    const condaVersion = 'py39_25.3.1-1'
    const condaUrl = `https://repo.anaconda.com/miniconda/Miniconda3-${condaVersion}-Linux-x86_64.sh` ;
    // 下载 Conda 安装程序
    core.startGroup(`下载 Conda 安装程序 ,  版本: ${condaVersion} `);
    const soft = 'soft/conda.sh';
    const condaInstallerPath = await tc.downloadTool(condaUrl, './' + soft);
    core.info(`Conda  ${condaVersion} 安装程序已下载到 :   ${condaInstallerPath}`);
    await exec.exec('ls', ['-l',  './' + soft]);
    core.endGroup();
}

export async function configConda() {
     // 安装 Conda
     core.startGroup('配置 Conda');
     const down = './' + 'soft/conda.sh';
     const condaDir = path.join(os.homedir(), 'miniconda3');
     await exec.exec('bash', [
       down,
       '-b',
       '-p', 
       condaDir
     ]);

// 配置环境变量
const condaBinDir = path.join(condaDir, 'bin');

// 
// 添加 Conda 到 PATH
core.addPath(condaBinDir);



// 设置环境变量供后续步骤使用
core.exportVariable('CONDA_HOME', condaDir);

    // 验证 Conda 安装
    await exec.exec('conda', ['--version']);
    core.endGroup();
}

export async function createVirtualEnv() {
    const pythonVersion = '3.9.18' ;
    // 创建环境并安装指定版本的 Python
       core.startGroup(`创建虚拟环境 Python 版本： ${pythonVersion}`);
       const envName = 'github_actions_env';
       await exec.exec('conda', [
         'create',
         '-y',
         '-q',
         '-n', 
         envName,
         `python=${pythonVersion}` 
       ]);
       core.info(`Python ${pythonVersion} 已安装到环境 ${envName}`);
        // 激活环境并配置 PATH
        const condaDir = path.join(os.homedir(), 'miniconda3');
        const envBinDir = path.join(condaDir, 'envs', envName, 'bin');
        core.addPath(envBinDir);
        core.info(`已将 ${envBinDir} 添加到 PATH`);
        // end 
       core.endGroup();
}


export async function activateEnv() {
  const envName = 'github_actions_env';

       const condaDir = path.join(os.homedir(), 'miniconda3');


  // init conda 
  await exec.exec('ls', ['-l', condaDir]);



  // 切换虚拟环境
//      core.startGroup(`切换虚拟环境 `);

    

//      await exec.exec('conda', [
//       'activate',
//       envName
//      ]);
//       // end 
//      core.endGroup();
}

export async function validVersion() {
  const envName = 'github_actions_env';
  
  core.startGroup('验证 Python 版本 和 pip 版本');

//  验证 Python 安装
  await exec.exec(`conda run -n ${envName} python --version`, [ ]);
  await exec.exec(`conda run -n ${envName} pip --version`, [ ]);

  // await exec.exec(`python --version`, [ ]);
  // await exec.exec(`pip --version`, [ ]);

  core.endGroup();
}
import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as fs from 'fs';

import archiver from 'archiver';


import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path, { sep } from 'path'
import os from 'os'


async function createTarGz(sourceDir: string, outPath: string) {
  const archive = archiver('tar', { gzip: true });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err: any) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve(outPath));
    archive.finalize();
  });
}



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


   //  安装指定的 npm 版本
   const npmVersion = '8.4.1';
   await exec.exec('npm', ['install', '-g', `npm@${npmVersion}`]);

   // 查看 npm 版本
   await exec.exec('npm', ['-v']);


   // 安装 nrm
   await exec.exec('npm', ['install', '-g', 'nrm']);

   // 配置 nrm
   const speed = 'taobao';
   await exec.exec('nrm', ['use', speed]);

   // 查看 nrm 配置
   await exec.exec('nrm', ['ls']);

    const projectPath = path.resolve(inputs.projectPath);

    console.log(`projectPath: ${projectPath}`);
    process.chdir(projectPath);

    await exec.exec('npm', ['install']);
    await exec.exec('npm', ['run', `${inputs.buildCommand}`]);

    // tc 压缩目录  build  到文件   dist.tar.gz
    // tar -czvf archive.tar.gz mydir
    // await exec.exec('tar', ['-czvf', './build.tar.gz', './build']);
    // await (tc as any).createArchive(projectPath, 'build.tar.gz', 'tgz');
    await createTarGz(projectPath + sep + 'build', 'build.tar.gz');
    
    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

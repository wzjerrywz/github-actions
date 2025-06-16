import * as core from '@actions/core'

import * as tc from '@actions/tool-cache'

import * as fs from 'fs';

import archiver from 'archiver';


import * as exec from '@actions/exec'
import {  getText } from './cmd'
import path from 'path'
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

    const projectPath = path.resolve(inputs.projectPath);

    console.log(`projectPath: ${projectPath}`);
    process.chdir(projectPath);

    await exec.exec('npm', ['install']);
    await exec.exec('npm', ['run', `${inputs.buildCommand}`]);

    // tc 压缩目录  build  到文件   dist.tar.gz
    // tar -czvf archive.tar.gz mydir
    // await exec.exec('tar', ['-czvf', './build.tar.gz', './build']);
    // await (tc as any).createArchive(projectPath, 'build.tar.gz', 'tgz');
    await createTarGz(projectPath, 'build.tar.gz');
    
    await exec.exec('ls', ['-l', './']);

  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}


// run
run()

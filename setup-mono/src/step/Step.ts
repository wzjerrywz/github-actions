import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';


import { Const } from '../common/Const';
const { __VERSION} = Const;


export class Step {

    DOWNLOAD_URL = 'https://download.mono-project.com/sources/mono/mono-<VERSION>.tar.xz' ;

    inputs: Partial<InputParamsType> ;

    constructor(inputs: Partial<InputParamsType>) {
        this.inputs = inputs;
    }

    async go() {
        // await this.configRepo();
        // await this.downloadMono();
        // await this.extract();
        // await this.install();
        const url = 'https://download.mono-project.com/sources/mono/mono-6.12.0.199.tar.xz';
        await exec.exec('curl -L -o mono-6.12.0.199.tar.xz ' + url);
          // 3. 下载并缓存
            // const downloadPath = await tc.downloadTool(url);
            // const extractDir = await tc.extractTar(downloadPath, '-xJ');
            // process.chdir(downloadPath));

            // 解压
            await exec.exec('pwd');
            await exec.exec('ls -l ./');
            await exec.exec('tar -xf mono-6.12.0.199.tar.xz -C ./');
            await exec.exec('ls -l ./');

   

            // 4. 缓存目录，方便复用
            const monoPath = await tc.cacheDir('./', 'mono', '6.12.0.199');

            // 5. 添加到 PATH
            const binDir = path.join(monoPath, 'bin');
            core.addPath(binDir);
            core.info(`Mono added to PATH: ${binDir}`);

            // 6. 验证安装
            let output = '';
            await exec.exec('mono', ['--version'], {
            listeners: {
                stdout: (data: Buffer) => { output += data.toString(); }
            }
            });
            core.info(`mono --version:\n${output}`);
            
    }

    async configRepo() {
        const title = `配置 mono 源： ${this.inputs.monoVersion!}` ;
        await this.groupWrapper(title, async () => {
            await exec.exec('ls -l ./');
            await exec.exec('pwd');
        });
    }

    async downloadMono() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`下载 `,  async () => {
                const url = this.DOWNLOAD_URL.replaceAll('<VERSION>', monoVersion!);
                await tc.downloadTool(url, path.resolve("./soft/mono"!, `mono-${monoVersion!}.tar.xz`));
                //
                process.chdir(path.resolve("./soft/mono", ``));
                await exec.exec('ls -l ./');
                await exec.exec('pwd');
        });
    }


    // 解压
    async extract() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`解压  ： .tar.xz `,  async () => {
                const name = `mono-${monoVersion!}.tar.xz`
                await exec.exec(`tar -xf ${name} -C ./`);
                //
                await exec.exec('ls -l ./');
                await exec.exec('pwd');
        });
    }

    // install
    async install() {
        const { monoVersion } = this.inputs;
            await this.groupWrapper(`安装 mono ： ${monoVersion}`,  async () => {
                process.chdir(`./mono-${monoVersion!}`);
                const list = [
                    './configure --prefix=/usr/local && make && make install'
                ] ;
                list.forEach(async (item) => {
                    await exec.exec(item);
                });
                // 查看版本
                await exec.exec('mono --version');
        });
    }

    // 组装函数
    async  groupWrapper(title: string, fn: () => Promise<void>) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn();
        // end group
        core.endGroup();
    };


}
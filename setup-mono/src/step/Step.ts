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

        const list = [
            'sudo apt-get update',
            'sudo apt-get install -y build-essential cmake ninja-build git',
            'git clone --depth=1 https://github.com/mono/mono.git'
        ] ;
        list.forEach(async (item) => {
            await exec.exec(item);
        });
        // 切换目录
        await exec.exec('ls -l ./');
        await exec.exec('pwd');
        process.chdir(path.resolve('./mono'));
        const list2 = [
            'chmod +x ./autogen.sh',
            './autogen.sh --prefix=/usr/local',
            'sudo make -j4',
            'sudo make install',
            'mono --version'
        ]; 
        list2.forEach(async (item) => {
            await exec.exec(item);
        });
        // 查看版本
        await exec.exec('mono', [__VERSION]);
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
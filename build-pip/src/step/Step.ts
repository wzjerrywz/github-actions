import { InputParamsType } from "../types/InputParamsType";

import * as child_process from 'child_process';


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    

    // async pipValidateVersion(inputs: Partial<InputParamsType>) {
    //     const title = ` 验证 pip 版本 ： ${inputs.pipVersion} ` ;
    //     await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
    //             // 验证
    //             //  验证 Python 安装
    //             await exec.exec(`conda run -n ${virtualEnv} python`, [ __VERSION ]);
    //             await exec.exec(`conda run -n ${virtualEnv} pip`, [ __VERSION ]);
    //     });
    // };

    // 清华镜像
    INDEX_URL = 'https://pypi.tuna.tsinghua.edu.cn/simple';

    async registerSpeedup(inputs: Partial<InputParamsType>) {
        const title = ` 注册加速镜像 ` ;
        await this.groupWrapper(inputs, title, async ({ virtualEnv }) => {
            // 注册加速镜像
            // pip config set global.index-url 
            const params = [ 'config', 'set', 'global.index-url', this.INDEX_URL ];
            await exec.exec(`conda run -n ${virtualEnv} pip`, params);
        });
    };

    async pipVersionInstall(inputs: Partial<InputParamsType>) {
        const title = ` 安装指定的 pip  版本： ${inputs.pipVersion} ` ;
        await this.groupWrapper(inputs, title, async ({ virtualEnv, pipVersion }) => {
                //   pip 安装 pip install --no-cache-dir --force-reinstall pip==23.1.2
                const params = [
                    INSTALL,
                    '--no-cache-dir',
                    '--force-reinstall',
                    `pip==${pipVersion}`
                ] ;
                await exec.exec(`conda run -n ${virtualEnv} pip`, params);
        });
    };


    async projectSetup(inputs: Partial<InputParamsType>) {
        const title = ` python  setup ` ;
        await this.groupWrapper(inputs, title, async ({ virtualEnv, pipVersion }) => {
                // 切换目录
                const workDir = './demo-python312-pip';
                process.chdir(path.resolve(workDir));

                // pip install wheel setuptools
                await exec.exec(`conda run -n ${virtualEnv} pip`, [ INSTALL, 'wheel', 'setuptools' ]);

                // python setup.py sdist bdist_wheel
                await exec.exec(`conda run -n ${virtualEnv} python`, [ 'setup.py', 'sdist', 'bdist_wheel' ]);
                // pwd 
                await exec.exec(`pwd`);
                await exec.exec(`ls -lh ./`);
                // await exec.exec(`conda run -n ${virtualEnv} pip`, params);
        });
    };


    // 组装函数
    async  groupWrapper(inputs: Partial<InputParamsType>, title: string, fn: (inputs: Partial<InputParamsType>) => Promise<void>) {
        // start group
        core.startGroup(title);
        // 执行函数
        await fn(inputs);
        // end group
        core.endGroup();
    };


}
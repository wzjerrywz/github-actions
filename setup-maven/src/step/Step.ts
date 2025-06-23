import { InputParamsType } from "../types/InputParamsType";


import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

import { Const } from '../common/Const';
const { __VERSION, INSTALL, _VERSION } = Const;

const { info } = core;

export class Step {

    inputs: Partial<InputParamsType> | unknown ;

    bigVersion = '3';

    URL_TEMPLATE = 'https://archive.apache.org/dist/maven/maven-<PREFIX>/<VERSION>/binaries/apache-maven-<VERSION>-bin.tar.gz' ;

    ENV_NAME = 'MAVEN_HOME';

    downloadPath = '';

    extractedPath = '';

    constructor() {
        this.validInputs();
    }

    // 整个流程
    async go() {
        await this.download();
        await this.tar();
        await this.env();
        await this.settings();
        await this.see();
    }

     // 下载
     async download() {
            const { mavenVersion , installPath } = this.inputs as InputParamsType;
            await this.groupWrapper(` 下载 maven , 版本号 ${mavenVersion} `,  async () => {
                const url = this.URL_TEMPLATE
                                .replaceAll('<PREFIX>', this.bigVersion)
                                .replaceAll('<VERSION>', mavenVersion);
                // 创建和授权目录 ./soft/maven
                await exec.exec(`sudo mkdir -p ${installPath}`);
                await exec.exec(`sudo chmod 777 ${installPath}`);
                this.downloadPath = await tc.downloadTool(url, path.resolve(installPath, `mvn${mavenVersion}.tar.gz`));
                core.info(`downloadPath:   ${this.downloadPath}`);
            });
        }

      // 解压
      async tar() {
            await this.groupWrapper(` 解压 `,  async () => {
                this.extractedPath = await tc.extractTar(this.downloadPath);
                core.info(`extractedPath:   ${this.extractedPath}`);
            });
     }

     // 配置环境变量
    async env() {
        await this.groupWrapper(` 配置环境变量 `,  async () => {
            const { mavenVersion  } = this.inputs as InputParamsType;

            // 配置环境变量
            const mavenHome = path.join(this.extractedPath, `apache-maven-${mavenVersion}`)
            // Add Maven to PATH
            core.addPath(path.join(mavenHome, 'bin'))
            core.exportVariable('MAVEN_HOME', mavenHome)
            core.exportVariable('M2_HOME', mavenHome)
            // 输出 maven-home
            core.setOutput('maven-home', mavenHome)
        });
    }


     // 配置 settings.xml , 用指定文件覆盖默认的 settings.xml
     async settings() {
        await this.groupWrapper(` 覆盖 settings.xml 文件 `,  async () => {
            const { mavenVersion  } = this.inputs as InputParamsType;
            core.info(` 覆盖 settings.xml 文件 `);
        });
    }

     // 查看
     async see() {
        await this.groupWrapper(` 查看 `,  async () => {
            await exec.exec(`java`, [_VERSION]);
            await exec.exec(`mvn`, ['-v']);
        });
    }

    validInputs() {
        // 获取输入参数
        this.inputs = {
            mavenVersion: core.getInput('maven-version', { required: true }),
            installPath: core.getInput('install-path', { required: true }),
        } ;
        // 验证输入参数
        core.info('validInputs() is ok 。');
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
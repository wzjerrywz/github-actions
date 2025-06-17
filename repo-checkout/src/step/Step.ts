import { InputParamsType } from "../types/InputParamsType";

import * as core from '@actions/core';
import * as exec from '@actions/exec';

import { Const } from '../common/Const';
const { __VERSION, INSTALL } = Const;

export class Step {

    // step1. 安装 git 
    async installGit(inputs: Partial<InputParamsType>) {
        const title = `安装git软件： apt-get install -y git` ;
        await this.groupWrapper(inputs, title, async (inputs) => {
                core.info(`${inputs.repoName!}`);
                // 安装 git
                await exec.exec('sudo', ['apt-get', INSTALL, '-y', 'git']);
                // 验证安装是否成功
                await exec.exec('git', [__VERSION]);
        });
    };

    async gitCloneComplex(inputs: Partial<InputParamsType>) {
        const title = `git clone 复杂操作` ;
        await this.groupWrapper(inputs, title, async (inputs) => {
            
                const [owner, repo] = inputs.repoName!.split('/');
                console.log(`owner: ${owner}, repo: ${repo}`);
            
                let USERNAME = '';
                let TOKEN = '';
                let URL = '';
                switch (owner) {
                    case 'gitee':
                        USERNAME = process.env.GITEE_USERNAME || '';
                        TOKEN = process.env.GITEE_TOKEN || '';
                        URL = 'https://oauth2:<TOKEN>@gitee.com/<USERNAME>/<REPOSITORY>.git';
                        break;
                    case 'github':
                        USERNAME = process.env.GITHUB_USERNAME || '';
                        TOKEN = process.env.GITHUB_TOKEN || '';
                        URL = 'git@github.com:<USERNAME>/<REPOSITORY>.git';
                        break;
                    case 'gitlab':
                        break;
                    default:
                        break;
                }
            
                const gitUrl = URL.replace('<USERNAME>', USERNAME)
                                 .replace('<TOKEN>', TOKEN)
                                 .replace('<REPOSITORY>', repo);
                
                await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, gitUrl]);
                await exec.exec('ls', ['-l', './']);
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
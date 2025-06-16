import { InputParamsType } from "../types/InputParamsType";
import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function gitCloneComplex(inputs: Partial<InputParamsType>) {
    process.chdir("./repo");
    core.startGroup(`git clone 复杂操作`);

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
    
    core.startGroup(`git clone -b ${inputs.branchName} ${gitUrl}`);
    await exec.exec('git', ['clone', '-b', `${inputs.branchName}`, gitUrl]);
    core.endGroup();
    await exec.exec('ls', ['-l', './']);
} 
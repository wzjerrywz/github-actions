import '@jest/globals';
// 测试 main.ts 文件
// 使用 jest 测试   
// ai 生成 测试用例



import * as core from '@actions/core';

import { run } from '../src/main';

// 模拟 @actions/core
jest.mock('@actions/core');

// const mockGetInput = jest.mocked(core.getInput);

// 定义输入参数映射
const inputMap: Record<string, string> = {
    'repo-name': 'gitee/demo-vue3-npm',
    'branch-name': 'master'
  };
  
  // 模拟 core.getInput 函数
  jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
         // 返回映射值，若无匹配则返回空字符串
         return inputMap[name] || ''; 
  });


describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  it('it()', async () => {
      console.log('it()');
      await run();
  }, 650000000);


  afterEach(() => {
    // 恢复所有模拟
    jest.restoreAllMocks(); 
  });

});


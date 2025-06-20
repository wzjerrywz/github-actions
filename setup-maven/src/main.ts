import * as core from '@actions/core'

import { Step } from './step/Step';

export async function run(): Promise<void> {
  try {
    // 执行
    await new Step().go();
  } catch (error: any) {
       core.setFailed(String(error)) ;
       throw new Error(error);
  }
} ;


// run
run();

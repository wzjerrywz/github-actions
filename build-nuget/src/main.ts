import * as core from '@actions/core';

import { Step } from './step/Step';

async function run(): Promise<void> {
  try {
    await new Step().go();
  } catch (error: any) {
       core.setFailed(error instanceof Error ? error.message : 'Unknown error') ;
       throw new Error(error);
  }
}

// run
run()

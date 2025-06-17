

import * as tc from '@actions/tool-cache';

const JDK_VERSION = '17.0.2';

const URL_TEMPLATE = 'https://download.java.net/java/GA/jdk<VERSION>/<SIGNURE>/GPL/openjdk-<VERSION>_linux-x64_bin.tar.gz';

const jdkVersionMap: Map<string, string> = new Map([
    ['17.0.2', 'dfd4a8d0985749f896bed50d7138ee7f/8'],
    ['18.0.2', 'f6ad4b4450fd4d298113270ec84f30ee/9'],
    ['19.0.1', 'afdd2e245b014143b62ccb916125e3ce/10'],
    ['20.0.2', '6e380f22cbe7469fa75fb448bd903d8e/9'],
    ['21.0.2', 'f2283984656d49d69e91c558476027ac/13'],
    ['22.0.2', 'c9ecb94cd31b495da20a27d4581645e8/9'],
    ['23.0.2', '6da2a6609d6e406f85c491fcb119101b/7'],
    ['24', '1f9ff9062db4449d8ca828c504ffae90/36']
  ]);

  const signature = jdkVersionMap.get(JDK_VERSION);

  const url = URL_TEMPLATE.replaceAll('<VERSION>', JDK_VERSION)
                          .replaceAll('<SIGNURE>', signature!);

//

 const tarName = `openjdk-${JDK_VERSION}_linux-x64_bin.tar.gz` ;
 const soft = './soft/' + tarName;
setTimeout(async () => {
    await tc.downloadTool(url, soft);
}, 1000);

setTimeout(async () => {
    const extractedPath = await tc.extractTar(soft);
    console.log(extractedPath);
}, 2000);




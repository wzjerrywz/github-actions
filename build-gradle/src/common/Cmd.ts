import { exec, getExecOutput } from '@actions/exec';


export class Cmd {

  static async getText(command: string, args: string[] = []): Promise<string> {
    try {
      const result = await getExecOutput(command, args, {
        silent: true,
        ignoreReturnCode: true
      });
  
      if (result.exitCode !== 0) {
        throw new Error(`命令执行失败，错误码: ${result.exitCode}, 错误信息: ${result.stderr.trim()}`);
      }
  
      return result.stdout.trim();
    } catch (error) {
      console.error(`获取命令输出时出错:`, error);
      throw error;
    }
  }
  
  // 模拟 capture 功能
  static async capture(command: any, args: any) {
      try {
        let output = '';
      const options = {
          // 禁止自动打印输出到 GitHub Actions 日志
        silent: false, 
        listeners: {
          stdout: (data: any) => {
            output += data.toString();
          }
        }
      };
      
      const exitCode = await exec(command, args, options);
      if (exitCode !== 0) {
        throw new Error(`Command failed with exit code ${exitCode}`);
      }
      
      return output.trim();
      } catch (error: any) {
        console.error(`Error executing command: ${error.message}`);
        args.unshift(command);
        throw new Error(`执行命令异常！ \n 命令： \n  ${ args.join(' ') } `); // 重新抛出错误，以便在测试中捕获
      }
    }

} ;
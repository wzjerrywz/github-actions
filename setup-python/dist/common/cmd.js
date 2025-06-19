"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmd = void 0;
const exec_1 = require("@actions/exec");
class Cmd {
    static async getText(command, args = []) {
        try {
            const result = await (0, exec_1.getExecOutput)(command, args, {
                silent: true,
                ignoreReturnCode: true
            });
            if (result.exitCode !== 0) {
                throw new Error(`命令执行失败，错误码: ${result.exitCode}, 错误信息: ${result.stderr.trim()}`);
            }
            return result.stdout.trim();
        }
        catch (error) {
            console.error(`获取命令输出时出错:`, error);
            throw error;
        }
    }
    // 模拟 capture 功能
    static async capture(command, args) {
        try {
            let output = '';
            const options = {
                // 禁止自动打印输出到 GitHub Actions 日志
                silent: false,
                listeners: {
                    stdout: (data) => {
                        output += data.toString();
                    }
                }
            };
            const exitCode = await (0, exec_1.exec)(command, args, options);
            if (exitCode !== 0) {
                throw new Error(`Command failed with exit code ${exitCode}`);
            }
            return output.trim();
        }
        catch (error) {
            console.error(`Error executing command: ${error.message}`);
            args.unshift(command);
            throw new Error(`执行命令异常！ \n 命令： \n  ${args.join(' ')} `); // 重新抛出错误，以便在测试中捕获
        }
    }
}
exports.Cmd = Cmd;
;

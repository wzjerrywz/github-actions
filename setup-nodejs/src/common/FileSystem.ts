
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileSystem {
    
   
static async  deleteDirectoryOrFile(path: string) {
    try {
      // 递归删除目录（force 选项允许删除非空目录）
      await fs.rm(path, { recursive: true, force: true });
      console.log(`目录已删除: ${path}`);
    } catch (error) {
      console.error(`删除目录失败: ${error}`);
    }
}

static async createDir(path: string) {
    try {
      await fs.mkdir(path, { recursive: true });
      console.log(`目录创建成功: ${path}`);
    } catch (error) {
      console.error(`创建目录失败: ${error}`);
    }
}


static async listDir(dirPath: string = '.') {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          console.log(`📁 目录: ${fullPath}`);
        } else {
          console.log(`📄 文件: ${fullPath}`);
        }
      }
    } catch (error) {
      console.error(`读取目录失败: ${error}`);
    }
  }
    
} ;


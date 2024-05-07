import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CodeService {
  private codesFolderPath: string = path.join('src', 'code', 'codes');

  async runCode(
    code: string,
    language: string,
    input: string,
    fileName: string,
  ) {
    console.log('received');

    let output;
    if (language === 'java') {
      const filePath = await this.writeCodeToFile(
        code,
        language,
        `${fileName}.java`,
      );
      output = await this.executeCode(input, filePath, `${fileName}.java`);
      return output;
    } else if (language === 'c_cpp') {
      const filePath = await this.writeCodeToFile(
        code,
        'cpp',
        `${fileName}.cpp`,
      );
      output = await this.compileAndRunCppCode(
        input,
        filePath,
        `${fileName}.cpp`,
      );

      output = output.replace(/src\\code\\codes\\cpp\\/g, '');
    } else if (language === 'python') {
      const filePath = await this.writeCodeToFile(
        code,
        language,
        `${fileName}.py`,
      );
      output = await this.executeCode(input, filePath, `${fileName}.py`);
    } else {
      const filePath = await this.writeCodeToFile(
        code,
        language,
        `${fileName}.js`,
      );
      output = await this.executeCode(input, filePath, `${fileName}.js`);
    }
    return output;
  }

  async writeCodeToFile(code: string, language: string, fileName: string) {
    const directoryPath = path.join(this.codesFolderPath, language);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const filePath = path.join(directoryPath, fileName);
    console.log(filePath);

    fs.writeFileSync(filePath, code);
    return filePath;
  }

  async compileAndRunCppCode(
    input: string,
    filePath: string,
    fileName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const executablePath = path.join(
        path.dirname(filePath),
        fileName.replace('.cpp', ''),
      );

      const compileProcess = spawn('g++', [filePath, '-o', executablePath]);
      let compileErrorOutput = '';

      compileProcess.stderr.on('data', (error) => {
        compileErrorOutput += error;
      });

      compileProcess.on('close', (code) => {
        if (code === 0) {
          const runProcess = spawn('./' + executablePath);
          let output = '';
          let errorOutput = '';

          runProcess.stdout.on('data', (data) => {
            output += data;
          });

          runProcess.stderr.on('data', (error) => {
            errorOutput += error;
          });

          runProcess.stdin.write(input);
          runProcess.stdin.end();

          runProcess.on('close', (code) => {
            if (code === 0) {
              resolve(output);
            } else {
              const errorMessage = errorOutput.toString();
              resolve(output + '\n' + errorMessage);
            }
          });
        } else {
          const errorMessage = compileErrorOutput.toString();

          resolve(errorMessage);
        }
      });
    });
  }

  async executeCode(
    input: string,
    filePath: string,
    fileName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let command;

      if (fileName.endsWith('.java')) {
        command = 'java';
      } else if (fileName.endsWith('.py')) {
        command = 'python3';
      } else if (fileName.endsWith('.js')) {
        command = 'node';
      } else if (fileName.endsWith('.cpp')) {
        command = 'g++';
      } else {
        reject(`Language ${path.extname(fileName)} not supported.`);
        return;
      }

      const process = spawn(command, [filePath]);

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data;
      });

      process.stderr.on('data', (error) => {
        errorOutput += error;
      });

      process.stdin.write(input);
      process.stdin.end();

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          const filenameOnly = path.basename(fileName);
          if (command === 'java') {
            const errorMessage = errorOutput.replace(filePath, filenameOnly);
            resolve(output + '\n' + errorMessage);
          } else if (command === 'node') {
            const errorMessage = errorOutput.replace(
              'C:\\Users\\sj210\\Desktop\\Final Project\\coding-platform\\src\\code\\codes\\javascript\\',
              '',
            );
            resolve(output + '\n' + errorMessage);
          } else {
            const errorMessage = errorOutput.replace(
              'C:\\Users\\sj210\\Desktop\\Final Project\\coding-platform\\src\\code\\codes\\python\\',
              '',
            );
            resolve(output + '\n' + errorMessage);
          }
        }
      });
    });
  }
}

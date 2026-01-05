#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import Fontmin from 'fontmin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 从 JSX/TSX 文件中提取文本内容
 * @param {string} filePath - 文件路径
 * @returns {Set<string>} - 提取的文本集合
 */
function extractTextFromFile(filePath) {
  if (filePath.endsWith('.d.ts')) {
    return new Set();
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 移除注释以避免提取不需要的文本
  content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ' ');

  const textSet = new Set();

  // 提取 content 属性中的文本 (常用于自定义 Link 组件)
  const contentRegex = /content\s*=\s*["`]([^"`]*)["`]/g;
  let match;
  while ((match = contentRegex.exec(content)) !== null) {
    const text = match[1];
    if (text && text.trim() && !text.includes('http') && !text.includes('javascript')) {
      textSet.add(text.trim());
    }
  }

  // 提取 JSX 子节点中的文本
  const jsxTextRegex = />([^<>{}]*?)(?:<\s*\/|{|$)/g;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    let text = match[1];
    if (text && text.trim() &&
      !text.includes('http') &&
      !text.includes('javascript') &&
      !text.includes('javascipt') &&
      !text.includes('data:image') &&
      !text.includes('mailto:') &&
      !text.includes('tel:') &&
      !text.includes('target=') &&
      !text.includes('url=') &&
      text.length > 0) {

      textSet.add(text.trim());
    }
  }

  // 提取普通字符串字面量
  const stringRegex = /["`](?:\\.|[^"\\])*["`]/g;
  while ((match = stringRegex.exec(content)) !== null) {
    let text = match[0].slice(1, -1); // 去掉引号

    // 过滤掉不需要的内容
    if (text && text.trim() &&
      text.length > 0 &&
      !text.includes('http') &&
      !text.includes('javascript') &&
      !text.includes('javascipt') &&
      !text.includes('data:image') &&
      !text.includes('mailto:') &&
      !text.includes('tel:') &&
      !text.includes('target=') &&
      !text.includes('url=') &&
      !text.includes('/>') &&
      !text.includes('px') &&
      !text.includes('#') &&
      !text.includes('%') &&
      !text.includes('{') &&
      !text.includes('}') &&
      !text.includes(';') &&
      !text.includes('/') &&
      !text.includes('\\')) {

      textSet.add(text.trim());
    }
  }

  return textSet;
}

/**
 * 扫描目录并提取所有文本
 * @param {string} dirPath - 目录路径
 * @returns {Set<string>} - 所有文本的集合
 */
function extractTextFromDirectory(dirPath) {
  const textSet = new Set();
  const extensions = ['.tsx', '.jsx', '.ts', '.js'];

  function scanDirectory(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const fullPath = path.join(currentPath, file);

      if (fs.statSync(fullPath).isDirectory()) {
        // 跳过 node_modules 和其他不需要的目录
        if (!['node_modules', '.git', 'dist', 'build', 'assets'].includes(file)) {
          scanDirectory(fullPath);
        }
      } else if (extensions.some(ext => file.endsWith(ext))) {
        const texts = extractTextFromFile(fullPath);
        texts.forEach(text => textSet.add(text));
      }
    }
  }

  scanDirectory(dirPath);
  return textSet;
}

/**
 * 处理文本并生成 fontmin 所需的字符串
 * @param {Set<string>} textSet - 文本集合
 * @returns {string} - 处理后的文本字符串
 */
function processTextForFontmin(textSet) {
  const texts = Array.from(textSet);

  // 合并所有文本并去重字符
  const allChars = texts.join('');
  const uniqueChars = [...new Set(allChars.split(''))].filter(char => char.trim() !== '').sort().join('');

  console.log('提取到的文本内容:');
  texts.sort().forEach((text, index) => {
    console.log(`${index + 1}. "${text}"`);
  });

  console.log(`\n总共提取 ${texts.length} 个文本片段`);
  console.log(`去重后的字符数量: ${uniqueChars.length}`);
  console.log(`包含的字符: ${uniqueChars}`);

  return uniqueChars;
}

/**
 * 运行 fontmin 命令
 * @param {string} text - 要包含的文本
 * @param {string} fontPath - 源字体路径
 * @param {string} outputDir - 输出目录
 */
function runFontmin(text, fontPath, outputDir) {
  return new Promise((resolve, reject) => {
    console.log('开始字体优化 (OTF to TTF + Subsetting + WOFF2)...');

    const fontmin = new Fontmin()
      .src(fontPath)
      .use(Fontmin.otf2ttf())
      .use(Fontmin.glyph({
        text: text,
        hinting: false
      }))
      .use(Fontmin.ttf2woff2())
      .dest(outputDir);

    fontmin.run((err, files) => {
      if (err) {
        return reject(err);
      }

      console.log('字体优化完成!');
      files.forEach(file => {
        console.log(`生成文件: ${file.path}`);
      });
      resolve(files);
    });
  });
}

/**
 * 主函数
 */
async function main() {
  const srcPath = path.join(__dirname, '../src');
  const fontPath = path.join(__dirname, '../font/SourceHanSerifSC-Regular.ttf');
  const outputDir = path.join(srcPath, 'assets');

  console.log('开始扫描源代码中的文本内容...');

  // 检查源字体文件是否存在
  if (!fs.existsSync(fontPath)) {
    console.error('源字体文件不存在:', fontPath);
    process.exit(1);
  }

  // 提取文本
  const textSet = extractTextFromDirectory(srcPath);

  const combinedText = processTextForFontmin(textSet);

  if (combinedText.length === 0) {
    console.log('没有提取到任何文本，跳过字体优化。');
    return;
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 运行 fontmin
  try {
    await runFontmin(combinedText, fontPath, outputDir);
    console.log('\n字体构建完成!');
    console.log(`优化后的字体文件已保存到: ${outputDir}`);
  } catch (error) {
    console.error('字体构建失败:', error.message);
    process.exit(1);
  }
}

main();

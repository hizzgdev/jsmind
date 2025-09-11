#!/usr/bin/env node

/**
 * jsMind 示例文件环境切换脚本
 * 使用方法：
 * node build-examples.js dev   - 切换到开发环境（使用本地源码）
 * node build-examples.js prod  - 切换到生产环境（使用CDN）
 */

const fs = require('fs');
const path = require('path');

const EXAMPLE_DIR = __dirname;
const TARGET_FILES = [
    '2_features.html',
    '2_features_cn.html'
];

// CDN配置
const CDN_CONFIG = {
    css: '//jsd.onmicrosoft.cn/npm/jsmind@0.9.0/style/jsmind.css',
    js: '//jsd.onmicrosoft.cn/npm/jsmind@0.9.0/es6/jsmind.js',
    draggable: '//jsd.onmicrosoft.cn/npm/jsmind@0.9.0/es6/jsmind.draggable-node.js',
    screenshot: '//jsd.onmicrosoft.cn/npm/jsmind@0.9.0/es6/jsmind.screenshot.js',
    domToImage: '//jsd.onmicrosoft.cn/npm/dom-to-image@2.6.0/dist/dom-to-image.min.js'
};

// 本地开发配置
const LOCAL_CONFIG = {
    css: '../style/jsmind.css',
    js: '../src/jsmind.js',
    draggable: '../src/plugins/jsmind.draggable-node.js',
    screenshot: '../src/plugins/jsmind.screenshot.js'
};

function updateFile(filename, isDev) {
    const filepath = path.join(EXAMPLE_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️  文件不存在: ${filename}`);
        return;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (isDev) {
        console.log(`🔧 切换 ${filename} 到开发环境...`);
        
        // 替换CSS链接
        content = content.replace(
            new RegExp(CDN_CONFIG.css.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            LOCAL_CONFIG.css
        );
        
        // 替换JS为ES6模块加载方式
        const cdnScriptPattern = new RegExp(
            `<script[^>]*src="${CDN_CONFIG.js.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*></script>`,
            'g'
        );
        
        if (content.match(cdnScriptPattern)) {
            content = content.replace(cdnScriptPattern, `
        <script type="module">
            import jsMind from '${LOCAL_CONFIG.js}';
            window.jsMind = jsMind;
            console.log('🔧 开发环境：使用本地jsMind源码');
        </script>`);
        }
        
        // 替换其他插件
        content = content.replace(
            new RegExp(CDN_CONFIG.draggable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            LOCAL_CONFIG.draggable
        );
        
        content = content.replace(
            new RegExp(CDN_CONFIG.screenshot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            LOCAL_CONFIG.screenshot
        );
        
        // 注释掉domToImage CDN（开发环境可能不需要）
        content = content.replace(
            new RegExp(`<script[^>]*src="${CDN_CONFIG.domToImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*></script>`, 'g'),
            `<!-- 开发环境：注释掉dom-to-image CDN
        <script type="text/javascript" src="${CDN_CONFIG.domToImage}"></script>
        -->`
        );
        
    } else {
        console.log(`🚀 切换 ${filename} 到生产环境...`);
        
        // 替换CSS链接
        content = content.replace(
            new RegExp(LOCAL_CONFIG.css.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            CDN_CONFIG.css
        );
        
        // 替换ES6模块为CDN脚本
        const modulePattern = /<script type="module">[^<]*import jsMind from[^<]*<\/script>/gs;
        if (content.match(modulePattern)) {
            content = content.replace(modulePattern, 
                `<script type="text/javascript" src="${CDN_CONFIG.js}"></script>`
            );
        }
        
        // 替换其他插件
        content = content.replace(
            new RegExp(LOCAL_CONFIG.draggable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            CDN_CONFIG.draggable
        );
        
        content = content.replace(
            new RegExp(LOCAL_CONFIG.screenshot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            CDN_CONFIG.screenshot
        );
        
        // 恢复domToImage CDN
        const commentedDomToImagePattern = /<!-- 开发环境：注释掉dom-to-image CDN[^]*?-->/gs;
        if (content.match(commentedDomToImagePattern)) {
            content = content.replace(commentedDomToImagePattern,
                `<script type="text/javascript" src="${CDN_CONFIG.domToImage}"></script>`
            );
        }
    }
    
    // 写入文件
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ ${filename} 更新完成`);
}

function main() {
    const mode = process.argv[2];
    
    if (!mode || !['dev', 'prod'].includes(mode)) {
        console.log(`
用法: node build-examples.js <mode>

模式:
  dev   - 开发环境 (使用本地源码文件)
  prod  - 生产环境 (使用CDN资源)

示例:
  node build-examples.js dev   # 切换到开发环境
  node build-examples.js prod  # 切换到生产环境
        `);
        process.exit(1);
    }
    
    const isDev = mode === 'dev';
    console.log(`\n🔄 开始切换到${isDev ? '开发' : '生产'}环境...\n`);
    
    TARGET_FILES.forEach(filename => {
        updateFile(filename, isDev);
    });
    
    console.log(`\n🎉 环境切换完成！当前环境: ${isDev ? '开发环境' : '生产环境'}`);
    
    if (isDev) {
        console.log(`
💡 开发环境提示:
   - 使用本地源码文件 (../src/jsmind.js)
   - 支持实时修改和调试
   - 需要启动本地服务器测试
   
📝 建议使用以下命令启动服务器:
   python -m http.server 8080
   或
   npx http-server -p 8080
        `);
    } else {
        console.log(`
🌐 生产环境提示:
   - 使用CDN资源
   - 适合部署到服务器
   - 可直接作为静态页面使用
        `);
    }
}

main();
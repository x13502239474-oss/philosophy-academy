/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 语义色名保持不变，只把色值换成羊皮卷体系，页面语义类自动适配
      colors: {
        void: '#E9D9B8',       // 主背景 · 古典羊皮纸
        surface: '#F2E7CE',    // 次级背景 · 浅羊皮纸
        panel: '#F6EDD9',      // 内容区 · 淡奶油纸
        elevated: '#EDE0C3',   // 辅助区 · 古旧纸张
        primary: '#793D36',    // 强调 · 勃艮第红
        secondary: '#A8874F',  // 强调 · 古铜金
        accent: '#586044',     // 强调 · 深橄榄绿
        ink: '#38291D',        // 主文字 · 深棕
        muted: '#87745A',      // 辅助文字
        line: '#C4AB82',       // 分隔线 · 淡金
      },
      fontFamily: {
        // 中文优先宋体（系统自带，保证清晰），英文用古典衬线；字体加载失败自动降级
        sans: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'STSong', 'SimSun', 'Georgia', 'serif'],
        display: ['Cinzel', '"Cormorant Garamond"', '"Noto Serif SC"', '"Songti SC"', 'Georgia', 'serif'],
        reading: ['"EB Garamond"', '"Noto Serif SC"', '"Songti SC"', 'STSong', 'Georgia', 'serif'],
      },
      boxShadow: {
        // 古典纸张的柔和投影，去掉科技感光晕
        glow: '0 2px 14px rgba(96,69,47,.10)',
        'glow-sm': '0 1px 6px rgba(96,69,47,.08)',
        page: '0 1px 0 rgba(255,255,255,.5) inset, 0 2px 10px rgba(96,69,47,.07)',
      },
    },
  },
  plugins: [],
}

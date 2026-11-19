/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080B14',
        surface: '#0E1422',
        panel: '#141D2D',
        elevated: '#1A2638',
        primary: '#4B9EFF',
        secondary: '#8C7CFF',
        accent: '#43D9D0',
        ink: '#E8EDF7',
        muted: '#8996AA',
        line: '#263247',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', '"PingFang SC"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(75,158,255,0.15)',
        'glow-sm': '0 0 20px rgba(75,158,255,0.12)',
      },
    },
  },
  plugins: [],
}

module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js",
  ],
  darkMode: 'class', // 启用基于类的深色模式
  theme: {
    extend: {
      // Apple 风格的自定义配置
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      colors: {
        'apple-blue': '#0071E3',
        'apple-gray': {
          50: '#F5F5F7',
          900: '#1D1D1F',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
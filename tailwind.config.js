   // tailwind.config.js 예시
   /** @type {import('tailwindcss').Config} */
   module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          // ... 다른 색상 변수들
        },
        borderColor: {
          DEFAULT: 'hsl(var(--border))', // DEFAULT 키를 사용하면 'border' 클래스로 사용 가능
          border: 'hsl(var(--border))', // 또는 'border-border' 클래스로 사용
        },
        // ... 기타 필요한 테마 확장
      },
    },
    plugins: [],
  };
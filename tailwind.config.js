   // tailwind.config.js 예시
   /** @type {import('tailwindcss').Config} */
   module.exports = {
    darkMode: ['class'], // 다크모드 활성화 (이미 있다면 유지)
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          // 기본 배경 및 텍스트
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          'page-background': 'hsl(var(--page-background))',
          'panel-background': 'hsl(var(--panel-background))',
          'text-primary': 'hsl(var(--text-primary))',
          'text-secondary': 'hsl(var(--text-secondary))',
          'text-muted': 'hsl(var(--text-muted))',
          'text-on-accent': 'hsl(var(--text-on-accent))',

          // 컴포넌트별 색상 (shadcn/ui 호환성 유지)
          card: 'hsl(var(--card))',
          'card-foreground': 'hsl(var(--card-foreground))',
          popover: 'hsl(var(--popover))',
          'popover-foreground': 'hsl(var(--popover-foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          border: 'hsl(var(--border))', // 기본 테두리 색상
          input: 'hsl(var(--input))',   // 입력 필드 테두리
          ring: 'hsl(var(--ring))',     // 포커스 링

          // 새로운 디자인 시스템 색상
          'sidebar-icon-bar-background': 'hsl(var(--sidebar-icon-bar-background))',
          'active-item-background': 'hsl(var(--active-item-background))',
          'active-item-foreground': 'hsl(var(--active-item-foreground))',
          'hover-bg-light': 'hsl(var(--hover-bg-light))',
          'hover-bg-dark': 'hsl(var(--hover-bg-dark))',
          'icon-color': 'hsl(var(--icon-color))',
          'icon-color-active': 'hsl(var(--icon-color-active))',
          'notification-badge-bg': 'hsl(var(--notification-badge-bg))',
          'notification-badge-text': 'hsl(var(--notification-badge-text))',
        },
        spacing: {
          // 레이아웃 간격
          'header-height': 'var(--header-height)',
          'icon-bar': 'var(--sidebar-icon-bar-width)',
          'menu-panel': 'var(--main-menu-panel-width)',
          'panel-padding-x': 'var(--panel-padding-x)',
          'panel-padding-y': 'var(--panel-padding-y)',
        },
        borderRadius: {
          DEFAULT: 'var(--radius)',
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          lg: 'var(--radius-lg)',
          xl: 'var(--radius-xl)',
          panel: 'var(--radius-panel)',
        },
        boxShadow: {
          sm: 'var(--shadow-sm)',
          DEFAULT: 'var(--shadow)',
          md: 'var(--shadow-md)',
          lg: 'var(--shadow-lg)',
          xl: 'var(--shadow-xl)',
          panel: 'var(--shadow-panel)',
          'icon-active': 'var(--shadow-icon-active)',
        },
        zIndex: {
          header: 'var(--z-header)',
          sidebar: 'var(--z-sidebar)',
          panel: 'var(--z-panel)',
          overlay: 'var(--z-overlay)',
          modal: 'var(--z-modal)',
          tooltip: 'var(--z-tooltip)',
          'document-viewer': 'var(--z-document-viewer)',
        },
        transitionDuration: {
          fast: 'var(--transition-fast)',
          normal: 'var(--transition-normal)',
          slow: 'var(--transition-slow)',
        },
        transitionTimingFunction: {
          default: 'var(--ease-default)',
        },
        // ... 기타 필요한 테마 확장
      },
    },
    plugins: [
      require('tailwindcss-animate'), // shadcn/ui 애니메이션 플러그인 (이미 있다면 유지)
    ],
  };
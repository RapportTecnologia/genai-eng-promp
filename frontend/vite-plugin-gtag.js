/**
 * Plugin Vite para injetar Google Analytics (gtag.js) no HTML
 * Injeta o script diretamente no <head> durante o build
 */
export default function vitePluginGtag(options = {}) {
  let gtagId = null;
  
  return {
    name: 'vite-plugin-gtag',
    
    // Captura a configuração do Vite para acessar as variáveis de ambiente
    configResolved(config) {
      // Busca o GTAG_ID das variáveis de ambiente do Vite
      gtagId = config.env.VITE_GTAG_ID || process.env.VITE_GTAG_ID || process.env.GTAG_ID || options.gtagId;
      
      if (!gtagId) {
        console.warn('⚠️  GTAG_ID não configurado - Google Analytics não será injetado');
        console.warn('   Configure VITE_GTAG_ID no arquivo .env do frontend');
      } else {
        console.log('✓ Google Analytics será injetado:', gtagId);
      }
    },
    
    transformIndexHtml(html) {
      if (!gtagId) {
        return html;
      }

      // Script do Google Analytics
      const gtagScript = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gtagId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gtagId}');
    </script>`;

      // Injeta o script antes do </head>
      const modifiedHtml = html.replace('</head>', `${gtagScript}\n  </head>`);
      
      return modifiedHtml;
    }
  };
}

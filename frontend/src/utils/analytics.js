/**
 * Inicializa o Google Analytics (gtag.js)
 * @param {string} gtagId - ID do Google Analytics (ex: G-XXXXXXXXXX)
 */
export function initializeGoogleAnalytics(gtagId) {
  if (!gtagId || typeof gtagId !== 'string' || !gtagId.startsWith('G-')) {
    console.warn('Google Analytics ID inválido ou não configurado:', gtagId);
    return;
  }

  // Verifica se já foi inicializado
  if (window.gtag) {
    console.log('Google Analytics já inicializado');
    return;
  }

  try {
    // Cria o script do gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    document.head.appendChild(script);

    // Inicializa o dataLayer e a função gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Configura o gtag
    gtag('js', new Date());
    gtag('config', gtagId);

    console.log('Google Analytics inicializado com sucesso:', gtagId);
  } catch (error) {
    console.error('Erro ao inicializar Google Analytics:', error);
  }
}

/**
 * Envia um evento personalizado para o Google Analytics
 * @param {string} eventName - Nome do evento
 * @param {object} eventParams - Parâmetros do evento
 */
export function trackEvent(eventName, eventParams = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Rastreia uma visualização de página
 * @param {string} pageTitle - Título da página
 * @param {string} pagePath - Caminho da página
 */
export function trackPageView(pageTitle, pagePath) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }
}

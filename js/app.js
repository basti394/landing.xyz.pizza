async function loadComponents() {
  const components = [
    { id: 'projects-container', url: 'components/projects.html' },
    { id: 'analysis-container', url: 'components/analysis.html' },
    { id: 'portfolio-container', url: 'components/portfolio.html', callback: initPortfolioChart },
    { id: 'about-container', url: 'components/about.html' },
  ];

  const loadingPromises = components.map(async (component) => {
    try {
      const response = await fetch(component.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${component.url}: ${response.statusText}`);
      }
      const text = await response.text();
      const container = document.getElementById(component.id);
      if (container) {
        container.innerHTML = text;
        if (component.callback) {
          component.callback();
        }
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
  });

  await Promise.all(loadingPromises);

  handleAnchor();
}

function handleAnchor() {
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Use a timeout to ensure the browser has had time to render everything
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}

loadComponents();

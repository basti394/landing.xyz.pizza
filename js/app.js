// No longer wait for DOMContentLoaded, as the script is at the end of the body.
// This ensures the function runs immediately.
loadComponents();

async function loadComponents() {
  const components = [
    { id: 'projects-container', url: 'components/projects.html' },
    { id: 'analysis-container', url: 'components/analysis.html' },
    { id: 'portfolio-container', url: 'components/portfolio.html', callback: initPortfolioChart },
    { id: 'about-container', url: 'components/about.html' },
  ];

  for (const component of components) {
    try {
      const response = await fetch(component.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${component.url}: ${response.statusText}`);
      }
      const text = await response.text();
      const container = document.getElementById(component.id);
      if (container) {
        container.innerHTML = text;
        // If a callback function is defined for the component, call it now
        if (component.callback) {
          component.callback();
        }
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }
}

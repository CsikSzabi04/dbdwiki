import { useEffect } from 'react';

/**
 * Hook to dynamically update SEO metadata (Title, Description)
 * @param {Object} options SEO options
 * @param {string} options.title Page title
 * @param {string} options.description Meta description
 */
const useSEO = ({ title, description }) => {
  useEffect(() => {
    // Update Document Title
    const prevTitle = document.title;
    if (title) {
        document.title = `${title} | DBD Hub`;
    }

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content');
    
    if (description && metaDescription) {
        metaDescription.setAttribute('content', description);
    }

    // Cleanup: Restoring original meta if necessary
    return () => {
      document.title = prevTitle;
      if (prevDescription && metaDescription) {
        metaDescription.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
};

export default useSEO;

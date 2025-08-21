/**
 * Wikipedia Service
 * Handles Wikipedia API integration with caching and error handling
 */

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Fetches Wikipedia summary for a given topic
 * @param {string} topic - The topic to search for
 * @returns {Promise<string>} Wikipedia extract or empty string
 */
const getWikipediaContext = async (topic) => {
  try {
    // Check cache first
    const cacheKey = topic.toLowerCase();
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
      {
        headers: {
          'User-Agent': 'QuizGenerator/1.0 (Educational Purpose)'
        },
        timeout: 5000
      }
    );

    if (response.ok) {
      const data = await response.json();
      const extract = data.extract || '';
      
      // Cache the result
      cache.set(cacheKey, {
        data: extract,
        timestamp: Date.now()
      });
      
      return extract;
    }
  } catch (error) {
    console.log('Wikipedia fetch failed:', error.message);
  }
  
  return '';
};

/**
 * Clears the Wikipedia cache
 */
const clearCache = () => {
  cache.clear();
};

module.exports = {
  getWikipediaContext,
  clearCache
};
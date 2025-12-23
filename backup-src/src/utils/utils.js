// Utilitaires gÃƒÂ©nÃƒÂ©raux pour Joman SIG

export const formatCoordinate = (coord, precision = 4) => {
  return parseFloat(coord.toFixed(precision));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export default {
  formatCoordinate,
  debounce,
  generateId
};

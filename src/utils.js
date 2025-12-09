export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

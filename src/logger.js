let logger = {
  error: (line, message, context) => {
    console.log(`[line ${line}] Error${context ?? ""}: ${message}`);
  },
};

export { logger };

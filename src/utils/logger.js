const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function format(level, message) {
  const time = new Date().toISOString();

  return `[${time}] ${level}: ${message}`;
}

export const log = {
  info(message) {
    console.log(
      colors.blue + format('INFO', message) + colors.reset
    );
  },

  success(message) {
    console.log(
      colors.green + format('SUCCESS', message) + colors.reset
    );
  },

  warn(message) {
    console.warn(
      colors.yellow + format('WARN', message) + colors.reset
    );
  },

  error(error) {
    if (error instanceof Error) {
      console.error(
        colors.red +
          format('ERROR', `${error.message}\n${error.stack}`) +
          colors.reset
      );
    } else {
      console.error(
        colors.red + format('ERROR', error) + colors.reset
      );
    }
  },
};

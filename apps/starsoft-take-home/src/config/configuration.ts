export const configuration = () => {
  return {
    DEV: process.env['NODE_ENV'] !== 'production',
    SWAGGER: !!process.env['SWAGGER'],
  };
};

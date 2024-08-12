export const configuration = () => {
  const brokers = process.env['KAFKA_BROKERS'];
  if (!brokers) {
    throw new Error('KAFKA_BROKERS Not Defined');
  }

  const brokers_arr = brokers.split(',');

  return {
    BROKERS: brokers_arr,
  };
};

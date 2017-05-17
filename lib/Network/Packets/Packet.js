const CustomBuffer = require('../../CustomBuffer')

/**
 * Packet Class
 */
class Packet {

  /**
   * Function called when encoding is needed
   * @param {CustomBuffer} data 
   */
  encode(data) { /* OVERRIDDEN BY CHILD */ }

  /**
   * Function called when decoding is needed
   * @param {CustomBuffer} data 
   */
  decode(data) { /* OVERRIDDEN BY CHILD */ }
}

module.exports = Packet
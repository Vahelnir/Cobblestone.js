class ChatColor {
  constructor(code, color, isFormat) {
    this.colorChar = '\u00A7'
    if (typeof code === 'string' && typeof color === 'number' && typeof isFormat === 'boolean') {
      this.code = code
      this.color = color
      this.isFormat = isFormat
    }
  }

  toString() {
    return this.colorChar + this.code
  }
  
  toJSON() {
    return this.toString()
  }

  get COLORS() {
    return colors
  }
}

const colors = {
  BLACK: new ChatColor('0', 0x0),
  DARK_BLUE: new ChatColor('1', 0x1),
  DARK_GREEN: new ChatColor('2', 0x2),
  DARK_AQUA: new ChatColor('3', 0x3),
  DARK_RED: new ChatColor('4', 0x4),
  DARK_PURPLE: new ChatColor('5', 0x5),
  GOLD: new ChatColor('6', 0x6),
  GRAY: new ChatColor('7', 0x7),
  DARK_GRAY: new ChatColor('8', 0x8),
  BLUE: new ChatColor('9', 0x9),
  GREEN: new ChatColor('a', 0xA),
  AQUA: new ChatColor('b', 0xB),
  RED: new ChatColor('c', 0xC),
  LIGHT_PURPLE: new ChatColor('d', 0xD),
  YELLOW: new ChatColor('e', 0xE),
  WHITE: new ChatColor('f', 0xF),
  MAGIC: new ChatColor('k', 0x10, true),
  BOLD: new ChatColor('l', 0x11, true),
  STRIKETHROUGH: new ChatColor('m', 0x12, true),
  UNDERLINE: new ChatColor('n', 0x13, true),
  ITALIC: new ChatColor('o', 0x14, true),
  RESET: new ChatColor('r', 0x15, true)
}

module.exports = ChatColor
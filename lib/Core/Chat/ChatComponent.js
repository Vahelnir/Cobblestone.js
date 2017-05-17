const ChatColor = require('./ChatColor')

const clickEventActions = ['run_command', 'open_file', 'open_url', 'suggest_command']
const hoverEventActions = ['show_text']

/**
 * @typedef {Object} ChatComponentPart
 * @property {string} text
 * @property {ChatColor} color 
 * @property {ChatColor[]} styles
 * @property {HoverEvent} hoverEvent 
 * @property {ClickEvent} clickEvent
 */

/**
 * @typedef {Object} ClickEvent
 * @property {string} action
 * @property {string} value 
 */

/**
 * @typedef {Object} HoverEvent
 * @property {string} action
 * @property {string} value 
 */

class ChatComponent {

  constructor(text) {
    this.componentParts = []
    if (text && typeof text === 'string')
      this.then(text)
  }

  /**
   * Add a color
   * @param {ChatColor} color
   * @returns {ChatComponent}
   */
  color(color) {
    this.last().color = color
    return this
  }

  /**
   * Add style
   * @param {...ChatColor} styles
   * @returns {ChatComponent}
   */
  style(...styles) {
    for (let i = 0; i < styles.length; i++) {
      if (!styles[i].isFormat)
        throw new Error('color is not a style')
    }
    if(!this.last().styles) this.last().styles = []
    this.last().styles = styles
    return this
  }

  /**
   * Append text
   * @param text
   * @returns {ChatComponent}
   */
  then(text) {
    this.componentParts.push({ text })
    return this
  }

  /**
   * Add a ClickEvent
   * @param {ClickEvent} clickEvent
   * @returns {ChatComponent}
   */
  click(clickEvent) {
    this.last().clickEvent = clickEvent
    return this
  }

  /**
   * Add a HoverEvent
   * @param {HoverEvent} hoverEvent
   * @returns {ChatComponent}
   */
  hover(hoverEvent) {
    this.last().hoverEvent = hoverEvent
    return this
  }

  /**
   * @return {ChatComponentPart} chatComponentPart
   */
  last() {
    return this.componentParts[this.componentParts.length - 1]
  }

  toJSON() {
    return {
      text: '',
      extra: this.componentParts
    }
  }
}

module.exports = ChatComponent
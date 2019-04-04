/**
 * Logs text to the console if Logger.enabled === true
 */
export class Logger {
  /**
   * Determines whether or not log messages
   * are printed to the console.
   */
  static isEnabled: boolean = true;

  /**
   * Logs objects to the console if
   * Logger.enabled === true
   * @param args The objects to log
   */
  static log(...args: any[]) {
    if (this.isEnabled) {
      console.log(...args);
    }
  }
}

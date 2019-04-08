/**
 * Describes the object that all TsGit
 * commands will return
 */
export interface CommandResult<T = any> {
  /**
   * Whether or not the command completed successfully
   */
  success: boolean;

  /**
   * The message that should be printed to the console
   */
  message?: string;

  /**
   * Additional data the can be passed with the command.
   * Allows one command to pass to another command.
   */
  data?: T;
}

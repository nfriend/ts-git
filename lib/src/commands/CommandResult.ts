/**
 * Describes the object that all TsGit
 * commands will return
 */
export interface CommandResult {
  success: boolean;
  message?: string;
}

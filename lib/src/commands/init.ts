export const initCommand = async (fs: any, cwd: string): Promise<void> => {
  console.log(`init was called with cwd: "${cwd}"!`);

  // Test if we're already in the root of an existing git repo.
  let isInRootOfGitRepo = false;
  try {
    const stats = await fs.statAsync(cwd + '/.git');
    isInRootOfGitRepo = stats.isDirectory();
  } catch (err) {}

  if (isInRootOfGitRepo) {
    console.log('in the root of an existing git repo!');
  } else {
    console.log('not in the root of an existing git repo.');
  }
};

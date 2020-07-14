const url = (path, base) => {
  try {
    return new URL(
      path,
      base,
    );
  } catch {
    const args = [path, base]
      .filter(Boolean)
      .map(arg => `'${arg}'`)
      .join(', ');

    throw new Error(`new URL(${args}) is not a valid URL`);
  }
};

export {
  url,
};

const url = (path, base, relative = false) => {
  try {
    return new URL(
      path,
      relative ? window.location.origin : base,
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

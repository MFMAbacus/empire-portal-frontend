export const clsx = (cls: unknown[]): string => {
  return cls.filter(Boolean).join(' ');
};

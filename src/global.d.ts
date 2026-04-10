declare module '*.png';
declare module '*.svg';
declare module '*.module.scss' {
  const cls: {readonly [className: string]: string};
  export default cls;
}

export const generateSvgPreview = ({
  svg_path,
  svg_polyline,
}: {
  svg_path?: string;
  svg_polyline?: string;
}): string => {
  const getInnerSvg = () => {
    if (svg_path) {
      return `<path d="${svg_path}" />`;
    }
    if (svg_polyline) {
      return `<polyline points="${svg_polyline}" />`;
    }
    return '';
  };

  const innerSvg = getInnerSvg();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">${innerSvg}</svg>`;
};

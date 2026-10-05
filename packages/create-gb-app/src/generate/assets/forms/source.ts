import formattedSource from './formatted-source.json';

export const rhfFormAssets = formattedSource.rhf;
export const tanstackFormAssets = formattedSource.tanstack;

export function notesFormSource(
  library: 'react-hook-form' | 'tanstack-form'
): string {
  return formattedSource.notes[library];
}

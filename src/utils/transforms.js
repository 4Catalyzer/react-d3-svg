export default function transforms(...transformsIn) {
  const transformsOut = transformsIn.join('');
  if (!transformsOut) {
    return null;
  }

  return transformsOut;
}

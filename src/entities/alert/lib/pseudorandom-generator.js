export default function generateId() {
  const sym = 'abcdefghijklmnopqrstuvwxyz1234567890';

  let id = '';

  for (let i = 0; i < 12; i += 1) {
    id += sym[parseInt(Math.random() * sym.length, 10)];
  }

  return id;
}

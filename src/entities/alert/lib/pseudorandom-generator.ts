export default function generateId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 12;
  let result = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

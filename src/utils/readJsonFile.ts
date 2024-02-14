import fs from 'fs/promises'

export default async function readJsonFile(path: string): Promise<object> {
  const data = await fs.readFile(path, 'utf8')
  const obj = JSON.parse(data)
  return obj
}

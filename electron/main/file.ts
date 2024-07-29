import fs from 'node:fs'

async function readFile(filePath: string): Promise<ArrayBuffer>{
  const data:ArrayBuffer = await fs.promises.readFile(filePath)
  return data
}

export {readFile}
  
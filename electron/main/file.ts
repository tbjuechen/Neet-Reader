import fs from 'node:fs'
import {dialog} from 'electron'

async function readFile(filePath: string): Promise<ArrayBuffer>{
  const data:ArrayBuffer = await fs.promises.readFile(filePath)
  return data
}

// 选择文件路径
function openFileDialog() {
  const files = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      { name: 'book', extensions: ['epub'] }
    ]
  })
  if (files) {
    return files[0]
  } else {
    return null
  }
}

export {readFile, openFileDialog}
  
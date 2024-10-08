import { app, BrowserWindow, shell, ipcMain, session } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { addBook, initUserDataPath, createCatalog, catalogColor, readCatalog, 
  catalog, updateCatalog, deleteCatalog, findCatalog, readBookInfo, readBook,
  deleteBook, add2Catalog } from './store'
import { readFile, openFileDialog } from './file'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))



// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  // 用户文件夹初始化检查
  await initUserDataPath()
  win = new BrowserWindow({
    title: 'Neet Reader',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    frame: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // win.webContents.session.loadExtension('F:\\Download\\QQDownload\\nhdogjmejiglipccpnnnanhbledajbpd_6.6.1')
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(async ()=>{
  // await session.defaultSession.loadExtension('F:\\Download\\QQDownload\\nhdogjmejiglipccpnnnanhbledajbpd_6.6.1')
  createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', async (_, arg) => {
  const bookInfo = await readBookInfo(arg)
  const childWindow = new BrowserWindow({
    title: bookInfo.name,
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  childWindow.setMenu(null);
  // childWindow.webContents.openDevTools();

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#/book/${arg}`)
    // childWindow.loadURL(`http://8.130.141.36:1234/`)
  } else {
    childWindow.loadFile(indexHtml, { hash: `/book/${arg}` })
  }
})

ipcMain.on('close-win', () => {
  if (win) win.close()
})

ipcMain.on('minimize-win', () => {
  if (win) win.minimize()
})

ipcMain.on('maximize-win', () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})

ipcMain.handle('create-book', async (_, book_path:string, cover:ArrayBuffer, catalog:string='default')=> {
  return await addBook(book_path, cover, catalog)
})

ipcMain.handle('read-file', async (_, file_path:string):Promise<ArrayBuffer> => {
  return await readFile(file_path)
})

ipcMain.handle('create-catalog', async (_, catalog_name:string, color:catalogColor):Promise<string> => {
  return await createCatalog(catalog_name, color)
})

ipcMain.handle('get-catalog-list', async (_) => {
  return await readCatalog()
})

ipcMain.handle('update-catalog', async (_, newCatalog: string) => {
  var newCatalogOBJ:catalog = JSON.parse(newCatalog)
  delete newCatalogOBJ['isSelect'] // 清除前端添加的isSelect属性
  return await updateCatalog(newCatalogOBJ)
})

ipcMain.handle('delete-catalog', async (_, catalog_uuid: string) => {
  return await deleteCatalog(catalog_uuid)
})

ipcMain.handle('find-catalog', async (_, catalog_uuid: string) => {
  return await findCatalog(catalog_uuid)
})

ipcMain.handle('read-book-info', async (_, book_uuid: string) => {
  return await readBookInfo(book_uuid)
})

ipcMain.handle('get-cover', async (_, book_uuid: string):Promise<ArrayBuffer> => {
  const bookStorePath:string = path.join(process.env.BOOKSPATH, book_uuid)
  const coverPath:string = path.join(bookStorePath, 'cover.jpg')
  return await readFile(coverPath)
})

ipcMain.handle('read-book', async (_, book_uuid: string):Promise<ArrayBuffer> => {
  return await readBook(book_uuid)
})

ipcMain.handle('open-file-dialog', (_) => {
  return openFileDialog()
})

ipcMain.handle('delete-book', async (_,book_id:string) =>{
  return await deleteBook(book_id)
})

ipcMain.handle('add-to-catalog', async (_, book_uuid:string, catalog_uuid:string) => {
  await add2Catalog(book_uuid, catalog_uuid)
})

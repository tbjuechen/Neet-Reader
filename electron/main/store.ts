import path from 'node:path'
import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'

const APPDATA:string = process.env.APPDATA
const USERDATAFILEPATH:string = path.join(APPDATA, 'NeetReader')
const BOOKSPATH:string = path.join(USERDATAFILEPATH, 'books_store')
process.env.BOOKSPATH = BOOKSPATH // 加入环境变量
const SHELFPATH:string = path.join(USERDATAFILEPATH, 'shelf_store')
const CATALOGPATH:string = path.join(SHELFPATH, 'catalog')

type catalogColor = 'gray'|'blue'|'green'|'purple'|'orange'|'red'

interface catalog{
  name: string,
  uuid: string,
  books: Array<string>
  filled?: catalogColor
}

interface book {
  uuid: string,
  name: string,
  lastRead: null | Date
}

async function initUserDataPath():Promise<void>{
  // 创建用户数据目录
  if (!fs.existsSync(USERDATAFILEPATH)){
    fs.mkdirSync(USERDATAFILEPATH)
    // 创建书籍存储
    fs.mkdirSync(BOOKSPATH)
    // 创建书架信息存储
    fs.mkdirSync(SHELFPATH)
    const catalogList:Array<catalog> = [
      {
        name: '默认书架',
        uuid: 'default',
        books: []
      }
    ]
    fs.writeFileSync(CATALOGPATH, JSON.stringify(catalogList))
  }
}

// 读书架
async function readCatalog():Promise<Array<catalog>> {
  try{
    const catalog:Array<catalog> = JSON.parse(await fs.promises.readFile(CATALOGPATH, 'utf-8'))
    return catalog
  } catch (e){
    console.log(e)
  }
}

// 写书架
async function writeCatalog(newCatalog:Array<catalog>):Promise<boolean>{
  try{
    await fs.promises.writeFile(CATALOGPATH, JSON.stringify(newCatalog), 'utf-8')
    return true
  }catch (e){
    console.log(e)
    return false
  }
}

// 创建新书架
async function createCatalog(catalog_name:string, color:catalogColor):Promise<string>{
  const catalog_uuid:string = uuidv4() 
  var catalog_info:catalog = {
    name: catalog_name,
    uuid: catalog_uuid,
    books: [],
    filled: color
  }
  var catalogLsit:Array<catalog> = await readCatalog()
  catalogLsit.push(catalog_info)
  await writeCatalog(catalogLsit)
  return catalog_uuid
}

// 通过uuid找到对应分类
async function findCatalog(uuid:string, catalogList:Array<catalog> | null = null):Promise<catalog>{
  // 未获得目录列表
  if (!catalogList){
    catalogList = await readCatalog()
  }
  const targetIndex = catalogList.findIndex((item:catalog)=>{ return item.uuid === uuid})
  if (targetIndex === -1){
    throw Error('Catalog not found')
  }
  return catalogList[targetIndex]
}

// 通过uuid更新分类
async function updateCatalog(newCatalog:catalog):Promise<boolean> {
  try{
    var catalogList:Array<catalog> = await readCatalog()
    const targetIndex = catalogList.findIndex((item:catalog)=>{ return item.uuid === newCatalog.uuid})
    if (targetIndex === -1){
      throw Error('Catalog not found')
    }
    catalogList[targetIndex] = newCatalog
    return await writeCatalog(catalogList)
  } catch (e) {
    console.log(e)
    return false
  }
}

// 将书籍添加到对应分类中
async function add2Catalog(book_uuid:string, catalog_uuid:string):Promise<void>{
  var catalog:catalog = await findCatalog(catalog_uuid)
  if (catalog.books.includes(book_uuid)) {
    throw Error(`Book ${book_uuid} already in catalog ${catalog_uuid}`)
  }
  catalog.books.push(book_uuid)
  await updateCatalog(catalog)
}

// 新建书籍
async function addBook(book_path:string, cover:ArrayBuffer, catalog_uuid:string='default'):Promise<string>{
  // 处理书籍
  var title:string = path.basename(book_path, path.extname(book_path)); // 书籍名
  const book_uuid:string = uuidv4()
  // 创建书籍基本信息
  const bookInfo:book = {
    uuid: book_uuid,
    name: title,
    lastRead: null
  }
  // 创建书籍文件夹
  const bookStorePath:string = path.join(BOOKSPATH, book_uuid)
  fs.mkdirSync(bookStorePath)  // 我就不信还能碰撞了
  // 创建封面
  const coverPath:string = path.join(bookStorePath, 'cover.jpg')
  fs.writeFileSync(coverPath, Buffer.from(cover))
  // 复制书籍
  const bookCopyPath:string = path.join(bookStorePath, title + path.extname(book_path))
  fs.copyFileSync(book_path, bookCopyPath)
  // 写入书籍信息
  const bookInfoPath:string = path.join(bookStorePath, 'info.json')
  fs.writeFileSync(bookInfoPath, JSON.stringify(bookInfo))
  // 添加到分类
  await add2Catalog(book_uuid, 'default')
  if (catalog_uuid !== 'default'){
    await add2Catalog(book_uuid, catalog_uuid)
  }
  return book_uuid
}

// 删除分类
async function deleteCatalog(catalog_uuid:string):Promise<boolean>{
  try{
    var catalogList:Array<catalog> = await readCatalog()
    const targetIndex = catalogList.findIndex((item:catalog)=>{ return item.uuid === catalog_uuid})
    if (targetIndex === -1){
      throw Error('Catalog not found')
    }
    catalogList.splice(targetIndex, 1)
    return await writeCatalog(catalogList)
  } catch (e) {
    console.log(e)
    return false
  }
}

// 读取书籍信息
async function readBookInfo(book_uuid:string):Promise<book>{
  const bookStorePath:string = path.join(BOOKSPATH, book_uuid)
  const bookInfoPath:string = path.join(bookStorePath, 'info.json')
  const bookInfo:book = JSON.parse(await fs.promises.readFile(bookInfoPath, 'utf-8'))
  return bookInfo
}

// 读取书籍文件
async function readBook(book_uuid:string):Promise<ArrayBuffer>{
  const bookInfo:book = await readBookInfo(book_uuid)
  const bookStorePath:string = path.join(BOOKSPATH, book_uuid)
  const bookPath:string = path.join(bookStorePath, bookInfo.name +'.epub')
  const data:ArrayBuffer = await fs.promises.readFile(bookPath)
  bookInfo.lastRead = new Date()
  await fs.promises.writeFile(path.join(bookStorePath, 'info.json'), JSON.stringify(bookInfo), 'utf-8')
  return data
}

// 删除书籍
async function deleteBook(book_uuid:string):Promise<boolean> {
  // 从各分类删除书籍
  var catalogList:Array<catalog> = await readCatalog()
  catalogList.forEach((_, index, arr) => {
    arr[index].books = arr[index].books.filter(item => {return item !== book_uuid})
  })
  await writeCatalog(catalogList)
  // 删除书籍文件
  const bookStorePath:string = path.join(BOOKSPATH, book_uuid)
  await fs.promises.rm(bookStorePath,{recursive: true, force: true})
  return true
}

export { initUserDataPath, createCatalog, addBook, 
  catalogColor, readCatalog, catalog, book, updateCatalog,
  deleteCatalog, findCatalog, readBookInfo, readBook, deleteBook }
import path from 'node:path'
import fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import Epub, { Book } from 'epubjs'

const APPDATA:string = '%APPDATA%'
const USERDATAFILEPATH:string = path.join(APPDATA, 'NeetReader')
const BOOKSPATH:string = path.join(USERDATAFILEPATH, 'books_store')
const SHELFPATH:string = path.join(USERDATAFILEPATH, 'shelf_store')

interface catalog{
  name: string,
  uuid: string,
  books: Array<string>
}

function initUserDataPath():void{
  // 创建用户数据目录
  if (!fs.existsSync(USERDATAFILEPATH)){
    fs.mkdirSync(USERDATAFILEPATH)
    // 创建书籍存储
    fs.mkdirSync(BOOKSPATH)
    // 创建书架信息存储
    fs.mkdirSync(SHELFPATH)
  }
}

async function createCatalog(catalog_name:string):Promise<string>{
  // 创建新书架
  const catalog_uuid:string = uuidv4() 
  const catalog_path:string = path.join(SHELFPATH, catalog_uuid)
  var catalog_info:catalog = {
    name: catalog_name,
    uuid: catalog_uuid,
    books: []
  }
  fs.writeFileSync(catalog_path, JSON.stringify(catalog_info))
  return catalog_uuid
}

async function addBook(book_path:string, catalog_uuid:string){
  // 处理书籍
  // const book:Book = new Book(book_path)
  var title:string = path.basename(book_path, path.extname(book_path));
  const book_uuid:string = uuidv4()
  // try{
  //   await book.ready
  //   const coverURL = await book.coverUrl()
  //   // const cover = await 
  // } catch (e){
  //   console.log(e)
  // }
    
  


  // 添加书籍到书架
  const catalog_path:string = path.join(SHELFPATH, catalog_uuid)
  var catalog_info:catalog = JSON.parse(fs.readFileSync(catalog_path, 'utf-8'))

}

export {initUserDataPath, createCatalog, addBook}
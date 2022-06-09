/*
 * @Description:
 * @version:
 * @Author:
 * @Date: 2022-05-06 14:59:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-09 17:17:22
 */
const { app, BrowserWindow,shell,ipcMain,session } = require('electron')
console.log(app.commandLine.hasSwitch('disable-gpu'))

// shell.openExternal('https://github.com')
const path = require('path')
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      x:50,
      y:50,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.loadFile('index.html')
    //win.addDevToolsExtension('file:///Users/4paradigm/Desktop/react-devtools/shells/chrome')
    win.webContents.openDevTools()
    const ses = win.webContents.session
    ses.cookies.get({}).then(cookies=>{console.log(cookies,'cookies')})
    console.log(ses.getUserAgent(),'sesion')

  }
  ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.setIgnoreMouseEvents(...args)
  })
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.reply('asynchronous-reply', 'pong')
  })

  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
  })
  let win
  let onlineStatusWindow
  app.whenReady().then(() => {
    const { screen } = require('electron')

    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    //if (externalDisplay) {
        // win = new BrowserWindow({
        //     width:800,
        //     height:600,
        //     webPreferences: {
        //         preload: path.join(__dirname, 'preload.js')
        //       }
        // })
        // win.loadURL('http://10.100.124.100:8081')


        // win.webContents.openDevTools()
    // }else{
         // Create a window that fills the screen's available work area.
        // const primaryDisplay = screen.getPrimaryDisplay()
        // const { width, height } = primaryDisplay.workAreaSize
        // mainWindow = new BrowserWindow({ width, height })
        // mainWindow.loadURL('https://electronjs.org')
        session.defaultSession.on('will-download', (event, item, webContents) => {
            event.preventDefault()
            require('got')(item.getURL()).then((response) => {
              require('fs').writeFileSync('/somewhere', response.body)
            })
          })
        createWindow()

        onlineStatusWindow = new BrowserWindow({
          width:800,
          height:600,
          webPreferences: {
            offscreen: true
          }

        })

        onlineStatusWindow.loadURL('file:///Users/4paradigm/Desktop/download-page/public/index.html')
        onlineStatusWindow.webContents.executeJavaScript('\
              alert(123);\
');
        onlineStatusWindow.webContents.setFrameRate(30)

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })

  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

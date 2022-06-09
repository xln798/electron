/*
 * @Description: 
 * @version: 
 * @Author: 
 * @Date: 2022-05-06 15:08:40
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-11 15:43:42
 */
const { ipcRenderer,contextBridge} = require('electron')
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
  })
ipcRenderer.send('asynchronous-message', 'ping')
contextBridge.exposeInMainWorld(
    'electron',
    {
      doThing: () => ipcRenderer.send('do-a-thing')
    }
  )

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
    const el = document.getElementById('clickThroughElement')
    el.addEventListener('mouseenter', () => {
        ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
    })
    el.addEventListener('mouseleave', () => {
        ipcRenderer.send('set-ignore-mouse-events', false)
    })
  })
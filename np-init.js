#!/usr/bin/env node
const argv = require('yargs').argv
const mongoose = require('mongoose')
const Group = require('./np-model/group.model')
const User = require('./np-model/user.model')
const storage = require('./np-utils/np-storage')
const secure = require('./np-utils/np-secure')
require('app-module-path').addPath(__dirname + '/')
const ProgressBar = require('progress')
// app modules
const config = require('np-config')
const mongodb = require('np-mongodb')

// data server
mongodb.connect()

/**
 * cms部署时候，初始化超级管理员与权限组
 */ 

// 1. 创建用权限组Group{name:'',privileges:''}
// 2. 获取Group的_id.
// 3. 创建用户User { email, password, group, isShow}
const email = argv.email
const password = argv.password

const initCMS = (email, password) => {
    (async()=>{
            // 创建权限组
            const newGroup = new Group()
            newGroup.name = '4MCMS超级管理员'
            newGroup.privileges = '4CEPGMBIZFA'
            let groupResult = await storage.save4MStorage(newGroup)
            // 初始化CMS超级管理员
            const newUser = new User()
            newUser.email = email
            newUser.password = await secure.cryptPassword(password.toString())
            newUser.group = groupResult._id
            newUser.isShow = true
            newUser.save()
            console.log('\x1B[31m%s\x1B[39m','Hi~ o(*￣▽￣*)ブ，现在初始化完成啦，请立即去部署启动项目啦~')
            console.log('\x1B[33m%s\x1b[0m:','初始化超级管理员:<email:>'+email +' '+'<password:>'+password)            
            console.log('Use command: `pm2 start app.js`')
            return true
    })()
}

if( email != undefined && password != undefined){
    console.log('\x1B[32m%s\x1B[39m','开始初始化4MCMS~~~~,请等待系统初始化完成....') 
    const bar = new ProgressBar(':bar', { total: 100 });
    const timer = setInterval(() => {
      bar.tick();
      if (bar.complete) {
        clearInterval(timer)
        initCMS(email, password)
      }
    }, 50)
}




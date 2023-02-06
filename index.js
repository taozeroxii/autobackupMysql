const express = require("express");
const server = express(); //use express
require('dotenv').config();//config ค่าใน env ไฟล์
const bodyParser = require("body-parser"); // paser data json format
const mysqldump = require("mysqldump"); //เรียกใช้ mysqldump
var fs = require('fs');


//ปกป้อง HTTP HEADER ด้วย Helmet
var helmet = require("helmet");
server.use(helmet());

// `ตั้งค่าการ parse ตัวแปรเมื่อ client request หรือส่งข้อมูลเข้ามา
server.use(bodyParser.urlencoded({ extended: false, limit: "500MB" }));
server.use(bodyParser.json({ limit: "500MB" }));

//cornjob
const config = require("./configs"); //config port and jobschdue
const { PORT } = config; // เรียกใช้ port จากไฟล์config
const { JOB_SCHEDULE,JOB_SCHEDULE2 } = config; // เรียกใช้ JOB_SCHEDULE จากไฟล์config
const cron = require("node-cron"); // เรียกใช้ node-cron จากไฟล์config
const moment = require("moment");




cron.schedule(JOB_SCHEDULE, () => { // autobackup report และ rcm ทุกตี 1 ของวัน
  function deleteOldfile(filePathsql){ // function delete file
    try {
      fs.unlinkSync(filePathsql);// ลบไฟล์ backup ตัวเดิมออก 
      console.log('successfully deleted '+filePathsql);
    }catch(error){
    console.error('there was an error:', error.message);
   }
  }
  function getLastWeeksDate() {// function getdate of lastweek 
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  }
  
  console.log(`Runtime ${moment().format("YYYYMMDD")}`);
  var filePathsql1 = `./autobackup/cpareport/report${moment(getLastWeeksDate()).format("YYYYMMDD")}.sql`; 
  deleteOldfile(filePathsql1);
  mysqldump({
    connection: {
      host: process.env.MYSQLRP_HOST,
      user:process.env.MYSQLRP_USER,
      password: process.env.MYSQLRP_PASSWORD,
      database: process.env.MYSQLRP_DB,
      charset: "utf8",
    },
    //Your directory to save sql file
    dumpToFile: `./autobackup/cpareport/report${moment().format( "YYYYMMDD" )}.sql`,
  });
});


cron.schedule(JOB_SCHEDULE2, () => {// autobackup cpawebsite และ elcaim ทุกตี 3 ของวัน
  function deleteOldfile(filePathsql){ // function delete file
    try {
      fs.unlinkSync(filePathsql);// ลบไฟล์ backup ตัวเดิมออก 
      console.log('successfully deleted '+filePathsql);
    }catch(error){
    console.error('there was an error:', error.message);
   }
  }
  function getLastWeeksDate() {// function getdate of lastweek 
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  }
  console.log(`Runtime ${moment().format("YYYYMMDD")}`);
  var filePathsql1 = `./autobackup/cpawebsite/cpawebsitedb-${moment(getLastWeeksDate()).format("YYYYMMDD")}.sql`; 
  var filePathsql2 = `./autobackup/m2cpa/m2-${moment(getLastWeeksDate()).format("YYYYMMDD")}.sql`; 
  deleteOldfile(filePathsql1);
  deleteOldfile(filePathsql2);  

  mysqldump({
    connection: {
      host: process.env.MYSQLCPAWEB_HOST,
      user:process.env.MYSQLCPAWEB_USER,
      password: process.env.MYSQLCPAWEB_PASSWORD,
      database: process.env.MYSQLCPAWEB_DB,
      charset: "utf8",
    }, dumpToFile: `./autobackup/cpawebsite/cpawebsitedb-${moment().format( "YYYYMMDD" )}.sql`,
  });

  mysqldump({
    connection: {
      host: process.env.MYSQLM2_HOST,
      user:process.env.MYSQLM2_USER,
      password: process.env.MYSQLM2_PASSWORD,
      database: process.env.MYSQLM2_DB,
      charset: "utf8",
    }, dumpToFile: `./autobackup/m2cpa/m2-${moment().format( "YYYYMMDD" )}.sql`,
  });

});



server.get("*", (req, res) => {
  //res.sendFile(`${__dirname}/dist/index.html`)
  res.end(`Backup cpareport eclaim rcm cpawebsite is running !!`);
});

server.listen(PORT, () => console.log(`sever started port: ${PORT} . `));

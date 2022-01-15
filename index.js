const express = require("express");
const server = express(); //use express
require('dotenv').config();//config ค่าใน env ไฟล์
const bodyParser = require("body-parser"); // paser data json format
const mysqldump = require("mysqldump"); //เรียกใช้ mysqldump

//ปกป้อง HTTP HEADER ด้วย Helmet
var helmet = require("helmet");
server.use(helmet());

// `ตั้งค่าการ parse ตัวแปรเมื่อ client request หรือส่งข้อมูลเข้ามา
server.use(bodyParser.urlencoded({ extended: false, limit: "500MB" }));
server.use(bodyParser.json({ limit: "500MB" }));

//cornjob
const config = require("./configs"); //config port and jobschdue
const { PORT } = config; // เรียกใช้ port จากไฟล์config
const { JOB_SCHEDULE } = config; // เรียกใช้ JOB_SCHEDULE จากไฟล์config
const cron = require("node-cron"); // เรียกใช้ node-cron จากไฟล์config
const moment = require("moment");

cron.schedule(JOB_SCHEDULE, () => {
  //backup database mysql dump every day at midnight.
  console.log(`Runtime ${moment().format("YYYYMMDD")}`);
  mysqldump({
    connection: {
      host: process.env.MYSQLRP_HOST,
      user:process.env.MYSQLRP_USER,
      password: process.env.MYSQLRP_PASSWORD,
      database: process.env.MYSQLRP_DB,
      charset: "utf8",
    },
    //Your directory to save sql file
    dumpToFile: `./backupBd0251/cpareport/report${moment().format( "YYYYMMDD" )}.sql`,
  });

  mysqldump({
    connection: {
      host: process.env.MYSQLRCM_HOST,
      user: process.env.MYSQLRCM_USER,
      password: process.env.MYSQLRCM_PASSWORD,
      database: process.env.MYSQLRCM_DB,
      charset: "utf8",
    },
    //Your directory to save sql file
    dumpToFile: `./backupBd0251/mysqleclaim/bkrcm-${moment().format("YYYYMMDD")}.sql`,
  });

});

server.get("*", (req, res) => {
  //res.sendFile(`${__dirname}/dist/index.html`)
  res.end(`backend server is started api insert data iview`);
});

server.listen(PORT, () => console.log(`sever started port: ${PORT} . `));

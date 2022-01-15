# autobackupMysql
Autobackup Mysql with Node js 
After Clone This's repositories

    1.Create an .env file in the downloaded folder.Copy Below Code,config To Connect Your data base
    This's Example To Connect  2database Mysql For Dump Data and stucture Sql
    #connection MYSQL REPORT DB
    MYSQLRP_HOST=
    MYSQLRP_USER=
    MYSQLRP_PASSWORD=
    MYSQLRP_DB=
    MYSQLRP_PORT=3306
    #connection MYSQL RCM DB
    MYSQLRCM_HOST=
    MYSQLRCM_USER=
    MYSQLRCM_PASSWORD=
    MYSQLRCM_DB=
    MYSQLRCM_PORT=3306
    2.Create Your Folder TO save .sql,Example in this project's The same Directory Create Folder backupBd0251 And 2 sub folder
        2.1.cpareport 2.2.mysqleclaim
    3.npm i 
    4.Run this project with pm2 http://pm2.keymetrics.io OR RUN THIS COMMAND   npm install pm2 -g
    5.pm2 start index.js -n backupdb -i 1



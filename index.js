const express = require('express');
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const port = 8000;
const config = {
    server: 'NOT\\SQLEXPRESS',
    database: 'test',
    options: {
       encrypt: false, 
       trustedConnection:true,
   },
   driver:"msnodesqlv8",
};
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/employeeform.html');
});
//getข้อมูลมา
app.get('/api/employees', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Employee ORDER BY EmpNum');
        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: 'ไม่พบข้อมูลพนักงาน' });
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อหรือดึงข้อมูล: ', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    } finally {
        sql.close();
    }
});
//บันทึกข้อมูลลงในฐานข้อมูล
app.post('/addEmployee', async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const empNum = req.body.EmpNum;
        const empName = req.body.EmpName;
        const position = req.body.Position;
        const query = `INSERT INTO Employee (EmpNum, EmpName, Position) VALUES ('${empNum}', N'${empName}', N'${position}')`;

        await pool.request().query(query);

        res.send('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ', error);
        res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
        sql.close();
    }
});


app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์ทำงานบนพอร์ต ${port}`);
});
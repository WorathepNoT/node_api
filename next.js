const sql = require("msnodesqlv8");


const connectionString = "server=.;Database=test;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from Employee";

sql.query(connectionString,query,(err,row) =>{
    console.log(row);
});
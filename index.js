import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { v4 as uuid4 } from "uuid";
import pg from "pg";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import path from "path";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "Public")));

app.set("view engine", "ejs");


const db = new pg.Client({
  user: "postgres",
  password: "kartik1217",
  database: "Nottify",
  host: "localhost",
  port: 5432,
})

db.connect();

let items = [];

app.get("/landing", (req, res) => {
  res.sendFile("/views/landing.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("/views/signup.html", { root: __dirname });
});
app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const uid = uuid4();
  try{
    const query = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (query.rows.length === 0) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if(err){
          console.log(err);
        }
        else{
          try {
            await db.query(
              `INSERT INTO users (id, name, email, password) VALUES ('${uid}', '${name}', '${email}', '${hash}')`
            );
            
            res.redirect("/login");
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
    else {
      console.log("User already exists");
      res.redirect("/signup");
    }
  }
  catch(e){
    console.log(e);
  }
});

app.get("/login", (req, res) => {
  res.sendFile("/views/login.html", { root: __dirname });
});
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

    try {
        const query = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (query.rows.length > 0) {
            const user = query.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    if(result){
                        const uid = user.id;
                        res.cookie("uid", uid);
                        res.redirect("/");
                    }
                    else{
                        console.log("Incorrect Password");
                        res.redirect("/login");
                    }
                }
            });
        } else {
            console.log("User does not exist");
            res.redirect("/login");
        }
    } catch (e) {
            console.log(e);
    }
});

app.get("/", async (req, res) => {
  try {
    const uid = req.cookies.uid;
    let name;
    try{
      const nameQuery = await db.query("SELECT name FROM users WHERE id = $1", [uid]);
      name = nameQuery.rows[0].name;
    }
    catch(e){
      console.log(e);
    }
    const result = await db.query("SELECT * FROM notes where user_id = $1", [uid]);
    items = result.rows;
    res.render("index.ejs", {
      listTitle: `${name}'s Notes`,
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", (req, res) => {
  const uid = req.cookies.uid;
  const title = req.body.newTitle;
  const item = req.body.newItem;
  db.query('insert into notes (user_id, title, data, created_at) values ($1, $2, $3, $4)', [uid, title, item, new Date()]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const uid = req.cookies.uid;
  const title = req.body.updatedItemTitle;
  const data = req.body.updatedItemData;
  db.query('update notes set title = $1 , data = $2 where user_id = $3',[title, data, uid]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const uid = req.cookies.uid;
  const title = req.body.deleteItemTitle;
  db.query('delete from notes where title = $2 and user_id = $1 ', [uid, title]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

var express = require("express");
var router = express.Router();
var fs = require("fs");

router.post("/", (req, res) => {
  let account = req.body;

  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      account = { id: json.nextId, ...account };
      json.nextId++;
      json.accounts.push(account);
      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get("/", (_, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get("/:id", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      const account = json.accounts.find(
        (account) => account.id === parseInt(req.params.id, 10)
      );
      if (account) {
        res.send(account);
      } else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let accounts = json.accounts.filter(
        (account) => account.id !== parseInt(req.params.id, 10)
      );
      json.accounts = accounts;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put("/", (req, res) => {
  let newAccount = req.body;

  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let oldIndex = json.accounts.findIndex(
        (account) => account.id === newAccount.id
      );
      json.accounts[oldIndex].name = newAccount.name;
      json.accounts[oldIndex].balance = newAccount.balance;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.post("/transaction", (req, res) => {
  let params = req.body;

  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let index = json.accounts.findIndex(
        (account) => account.id === params.id
      );

      if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
        throw new Error("Não há saldo o suficiente");
      }
      json.accounts[index].balance += params.value;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.send(json.accounts[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;

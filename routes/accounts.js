var express = require("express");
var router = express.Router();
var fs = require("fs");

router.post("/", (req, res) => {
  let account = req.body;

  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (!err) {
      try {
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
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get("/", (_, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get("/:id", (req, res) => {
  //req.params.id;
  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      const account = json.account.find(
        (account) => account.id === req.params.id
      );
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;

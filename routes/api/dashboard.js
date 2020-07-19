const router = require("express").Router();
const Cabinet = require("../../models/cabinet");
const User = require("../../models/user");
const Station = require("../../models/station");

router.get("/", (req, res) => {
  let result = {
    cabinet: {},
    user: {},
    station: {},
  };

  Cabinet.find((err, cabinets) => {
    var activeCabinets = [];
    var stateCabinets = [];
    if (err) {
      console.log("Error: " + err);
    } else {
      result.cabinet.total = cabinets.length;
      for (let i = 0; i < cabinets.length; i++) {
        if (cabinets[i].active == 1) {
          activeCabinets.push(cabinets[i]);
        }
        if (cabinets[i].state == 1) {
          stateCabinets.push(cabinets[i]);
        }
      }
      result.cabinet.active = activeCabinets.length;
      result.cabinet.used = stateCabinets.length;
      User.find((err, users) => {
        var activeUsers = [];
        var stateUsers = [];
        if (err) {
          console.log("Error: " + err);
        } else {
          result.user.total = users.length;
          for (let i = 0; i < users.length; i++) {
            if (users[i].active == 1) {
              activeUsers.push(users[i]);
            }
            if (users[i].online == 1) {
              stateUsers.push(users[i]);
            }
          }
          result.user.active = activeUsers.length;
          result.user.online = stateUsers.length;
          Station.find((err, stations) => {
            var activeStations = [];
            if (err) {
              console.log("Error: " + err);
            } else {
              result.station.total = stations.length;
              for (let i = 0; i < stations.length; i++) {
                if (stations[i].active) {
                  activeStations.push(stations[i]);
                }
              }
              result.station.active = activeStations.length;
              res.json(result);
            }
          });
        }
      });
    }
  });
});

router.get("/listener", (req, res) => {
  let userListen = User.watch();
  let cabinetListen = Cabinet.watch();
  let stationListen = Station.watch();
  let flag = false;
  userListen.on("change", (response) => {
    flag = true;
    userListen.close();
  });
  cabinetListen.on("change", (response) => {
    flag = true;
    cabinetListen.close();
  });
  stationListen.on("change", (response) => {
    flag = true;
    stationListen.close();
  });

  res.setTimeout(5000, () => {
    if (!flag) {
      res.json(false);
      userListen.close();
      cabinetListen.close();
      stationListen.close();
    } else {
      res.json(true);
    }
  });
});

router.get("/station", (req, res) => {
  let result = {
    data: {},
  };
  Station.find()
    .populate("price_id")
    .exec((err, stations) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        result.total = stations.length;
        result.data = stations;
      }
      res.json(result);
    });
});

module.exports = router;
